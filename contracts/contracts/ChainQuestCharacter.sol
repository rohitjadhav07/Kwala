// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ChainQuestCharacter
 * @dev NFT contract for ChainQuest game characters with evolution mechanics
 */
contract ChainQuestCharacter is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Character stats structure
    struct CharacterStats {
        uint256 level;
        uint256 experience;
        uint256 strength;
        uint256 defense;
        uint256 speed;
        uint256 magic;
        string characterClass;
        uint256 evolutionStage;
        uint256 lastActivityTime;
    }
    
    // Mapping from token ID to character stats
    mapping(uint256 => CharacterStats) public characterStats;
    
    // Mapping from owner to their characters
    mapping(address => uint256[]) public ownerCharacters;
    
    // Evolution requirements
    mapping(uint256 => uint256) public evolutionRequirements; // stage => required experience
    
    // Authorized contracts that can modify stats
    mapping(address => bool) public authorizedContracts;
    
    // Minting fee (0.1 MATIC for hackathon)
    uint256 public mintingFee = 0.1 ether;
    
    // Events
    event CharacterMinted(address indexed owner, uint256 indexed tokenId, string characterClass);
    event CharacterEvolved(uint256 indexed tokenId, uint256 newStage, uint256 newLevel);
    event ExperienceGained(uint256 indexed tokenId, uint256 experience, uint256 newTotal);
    event StatsUpdated(uint256 indexed tokenId, uint256 strength, uint256 defense, uint256 speed, uint256 magic);
    event MintingFeeUpdated(uint256 newFee);
    
    constructor() ERC721("ChainQuest Character", "CQC") {
        // Set evolution requirements
        evolutionRequirements[1] = 100;   // Stage 1 -> 2: 100 XP
        evolutionRequirements[2] = 500;   // Stage 2 -> 3: 500 XP  
        evolutionRequirements[3] = 1500;  // Stage 3 -> 4: 1500 XP
        evolutionRequirements[4] = 5000;  // Stage 4 -> 5: 5000 XP
    }
    
    /**
     * @dev Mint a new character NFT (owner only, for admin)
     */
    function mintCharacter(
        address to,
        string memory characterClass,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        return _mintCharacter(to, characterClass, tokenURI, 0, 0, 0, 0);
    }
    
    /**
     * @dev Public mint function with payment and custom stats
     */
    function mintCharacter(
        address to,
        string memory tokenURI,
        uint8 characterClass,
        uint256[4] memory stats
    ) public payable returns (uint256) {
        require(msg.value >= mintingFee, "Insufficient payment");
        require(characterClass <= 2, "Invalid character class");
        
        string memory className = _getClassName(characterClass);
        return _mintCharacter(to, className, tokenURI, stats[0], stats[1], stats[2], stats[3]);
    }
    
    /**
     * @dev Internal mint function
     */
    function _mintCharacter(
        address to,
        string memory characterClass,
        string memory tokenURI,
        uint256 strength,
        uint256 defense,
        uint256 speed,
        uint256 magic
    ) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Use provided stats or default base stats
        uint256 finalStrength = strength > 0 ? strength : _getBaseStats(characterClass, "strength");
        uint256 finalDefense = defense > 0 ? defense : _getBaseStats(characterClass, "defense");
        uint256 finalSpeed = speed > 0 ? speed : _getBaseStats(characterClass, "speed");
        uint256 finalMagic = magic > 0 ? magic : _getBaseStats(characterClass, "magic");
        
        // Initialize character stats
        characterStats[tokenId] = CharacterStats({
            level: 1,
            experience: 0,
            strength: finalStrength,
            defense: finalDefense,
            speed: finalSpeed,
            magic: finalMagic,
            characterClass: characterClass,
            evolutionStage: 1,
            lastActivityTime: block.timestamp
        });
        
        ownerCharacters[to].push(tokenId);
        
        emit CharacterMinted(to, tokenId, characterClass);
        return tokenId;
    }
    
    /**
     * @dev Get class name from index
     */
    function _getClassName(uint8 classIndex) internal pure returns (string memory) {
        if (classIndex == 0) return "warrior";
        if (classIndex == 1) return "mage";
        if (classIndex == 2) return "rogue";
        return "warrior";
    }
    
    /**
     * @dev Add experience to a character (only authorized contracts)
     */
    function addExperience(uint256 tokenId, uint256 experience) external {
        require(authorizedContracts[msg.sender], "Not authorized");
        require(_exists(tokenId), "Character does not exist");
        
        CharacterStats storage stats = characterStats[tokenId];
        stats.experience += experience;
        stats.lastActivityTime = block.timestamp;
        
        // Check for level up
        uint256 newLevel = _calculateLevel(stats.experience);
        if (newLevel > stats.level) {
            stats.level = newLevel;
            _levelUpStats(tokenId, newLevel);
        }
        
        emit ExperienceGained(tokenId, experience, stats.experience);
        
        // Check for evolution
        _checkEvolution(tokenId);
    }
    
    /**
     * @dev Evolve character to next stage
     */
    function evolveCharacter(uint256 tokenId) external {
        require(authorizedContracts[msg.sender] || ownerOf(tokenId) == msg.sender, "Not authorized");
        require(_exists(tokenId), "Character does not exist");
        
        CharacterStats storage stats = characterStats[tokenId];
        uint256 currentStage = stats.evolutionStage;
        
        require(currentStage < 5, "Already at max evolution");
        require(stats.experience >= evolutionRequirements[currentStage], "Insufficient experience");
        
        stats.evolutionStage++;
        stats.level += 5; // Bonus levels on evolution
        
        // Boost all stats on evolution
        stats.strength += 10 + (currentStage * 5);
        stats.defense += 8 + (currentStage * 4);
        stats.speed += 6 + (currentStage * 3);
        stats.magic += 12 + (currentStage * 6);
        
        emit CharacterEvolved(tokenId, stats.evolutionStage, stats.level);
        emit StatsUpdated(tokenId, stats.strength, stats.defense, stats.speed, stats.magic);
    }
    
    /**
     * @dev Update character metadata URI (for evolution visuals)
     */
    function updateTokenURI(uint256 tokenId, string memory newURI) external {
        require(authorizedContracts[msg.sender], "Not authorized");
        require(_exists(tokenId), "Character does not exist");
        
        _setTokenURI(tokenId, newURI);
    }
    
    /**
     * @dev Get character's battle power
     */
    function getBattlePower(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Character does not exist");
        
        CharacterStats memory stats = characterStats[tokenId];
        return (stats.strength + stats.defense + stats.speed + stats.magic) * stats.level;
    }
    
    /**
     * @dev Get all characters owned by an address
     */
    function getCharactersByOwner(address owner) external view returns (uint256[] memory) {
        return ownerCharacters[owner];
    }
    
    /**
     * @dev Authorize a contract to modify character stats
     */
    function authorizeContract(address contractAddress, bool authorized) external onlyOwner {
        authorizedContracts[contractAddress] = authorized;
    }
    
    /**
     * @dev Update minting fee (owner only)
     */
    function setMintingFee(uint256 newFee) external onlyOwner {
        mintingFee = newFee;
        emit MintingFeeUpdated(newFee);
    }
    
    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Get tokens owned by address (for frontend)
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        return ownerCharacters[owner];
    }
    
    /**
     * @dev Get character stats and metadata
     */
    function getCharacterStats(uint256 tokenId) external view returns (
        uint8 class,
        uint256 level,
        uint256 experience,
        uint256[4] memory stats
    ) {
        require(_exists(tokenId), "Character does not exist");
        
        CharacterStats memory character = characterStats[tokenId];
        
        // Convert class string to index
        uint8 classIndex = 0;
        if (keccak256(abi.encodePacked(character.characterClass)) == keccak256("mage")) {
            classIndex = 1;
        } else if (keccak256(abi.encodePacked(character.characterClass)) == keccak256("rogue")) {
            classIndex = 2;
        }
        
        return (
            classIndex,
            character.level,
            character.experience,
            [character.strength, character.defense, character.speed, character.magic]
        );
    }
    
    // Internal functions
    function _getBaseStats(string memory characterClass, string memory statType) internal pure returns (uint256) {
        bytes32 classHash = keccak256(abi.encodePacked(characterClass));
        bytes32 statHash = keccak256(abi.encodePacked(statType));
        
        if (classHash == keccak256("warrior")) {
            if (statHash == keccak256("strength")) return 25;
            if (statHash == keccak256("defense")) return 20;
            if (statHash == keccak256("speed")) return 10;
            if (statHash == keccak256("magic")) return 5;
        } else if (classHash == keccak256("mage")) {
            if (statHash == keccak256("strength")) return 8;
            if (statHash == keccak256("defense")) return 10;
            if (statHash == keccak256("speed")) return 12;
            if (statHash == keccak256("magic")) return 30;
        } else if (classHash == keccak256("rogue")) {
            if (statHash == keccak256("strength")) return 15;
            if (statHash == keccak256("defense")) return 12;
            if (statHash == keccak256("speed")) return 25;
            if (statHash == keccak256("magic")) return 8;
        }
        
        return 15; // Default stat
    }
    
    function _calculateLevel(uint256 experience) internal pure returns (uint256) {
        if (experience < 50) return 1;
        if (experience < 150) return 2;
        if (experience < 300) return 3;
        if (experience < 500) return 4;
        if (experience < 750) return 5;
        
        // Level 6+ formula: level = 5 + sqrt((experience - 750) / 100)
        return 5 + _sqrt((experience - 750) / 100);
    }
    
    function _levelUpStats(uint256 tokenId, uint256 newLevel) internal {
        CharacterStats storage stats = characterStats[tokenId];
        uint256 levelDiff = newLevel - stats.level;
        
        // Stat growth per level based on class
        bytes32 classHash = keccak256(abi.encodePacked(stats.characterClass));
        
        if (classHash == keccak256("warrior")) {
            stats.strength += levelDiff * 3;
            stats.defense += levelDiff * 2;
            stats.speed += levelDiff * 1;
            stats.magic += levelDiff * 1;
        } else if (classHash == keccak256("mage")) {
            stats.strength += levelDiff * 1;
            stats.defense += levelDiff * 1;
            stats.speed += levelDiff * 2;
            stats.magic += levelDiff * 4;
        } else if (classHash == keccak256("rogue")) {
            stats.strength += levelDiff * 2;
            stats.defense += levelDiff * 1;
            stats.speed += levelDiff * 3;
            stats.magic += levelDiff * 1;
        }
        
        emit StatsUpdated(tokenId, stats.strength, stats.defense, stats.speed, stats.magic);
    }
    
    function _checkEvolution(uint256 tokenId) internal {
        CharacterStats memory stats = characterStats[tokenId];
        uint256 currentStage = stats.evolutionStage;
        
        if (currentStage < 5 && stats.experience >= evolutionRequirements[currentStage]) {
            // Auto-evolve if requirements are met
            this.evolveCharacter(tokenId);
        }
    }
    
    function _sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}