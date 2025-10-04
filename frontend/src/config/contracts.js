// Contract addresses and ABIs
export const CONTRACT_ADDRESSES = {
  // Local development addresses
  hardhat: {
    ChainQuestCharacter: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    QuestManager: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    TournamentManager: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  },
  localhost: {
    ChainQuestCharacter: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    QuestManager: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    TournamentManager: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  },
  sepolia: {
    ChainQuestCharacter: "0x...", // Will be filled after deployment
    QuestManager: "0x...",
    TournamentManager: "0x..."
  },
  mumbai: {
    ChainQuestCharacter: "0x...", // Will be updated after Mumbai deployment
    QuestManager: "0x...",
    TournamentManager: "0x..."
  },
  // Polygon Amoy testnet (new official testnet)
  amoy: {
    ChainQuestCharacter: "0x0aF5DACFe9DeAAf38413D55CeC0F16a850ED162D", // ✅ DEPLOYED!
    QuestManager: "0x...", // Need more MATIC to deploy
    TournamentManager: "0x..." // Need more MATIC to deploy
  },
  80002: {
    ChainQuestCharacter: "0x0aF5DACFe9DeAAf38413D55CeC0F16a850ED162D", // ✅ DEPLOYED!
    QuestManager: "0x...", // Need more MATIC to deploy
    TournamentManager: "0x..." // Need more MATIC to deploy
  }
};

// Simplified ABIs for the functions we need
export const CHARACTER_ABI = [
  "function mintCharacter(address to, string memory characterClass, string memory tokenURI) public returns (uint256)",
  "function getCharactersByOwner(address owner) external view returns (uint256[] memory)",
  "function characterStats(uint256 tokenId) public view returns (uint256 level, uint256 experience, uint256 strength, uint256 defense, uint256 speed, uint256 magic, string memory characterClass, uint256 evolutionStage, uint256 lastActivityTime)",
  "function getBattlePower(uint256 tokenId) external view returns (uint256)",
  "function addExperience(uint256 tokenId, uint256 experience) external",
  "function evolveCharacter(uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "event CharacterMinted(address indexed owner, uint256 indexed tokenId, string characterClass)",
  "event CharacterEvolved(uint256 indexed tokenId, uint256 newStage, uint256 newLevel)",
  "event ExperienceGained(uint256 indexed tokenId, uint256 experience, uint256 newTotal)"
];

export const QUEST_ABI = [
  "function createQuest(string memory title, string memory description, uint256 experienceReward, uint256 tokenReward, uint256 target, uint256 duration) external returns (uint256)",
  "function startQuest(uint256 questId) external",
  "function updateQuestProgress(address player, uint256 questId, uint256 progress) external",
  "function completeQuest(address player, uint256 questId) external",
  "function getPlayerActiveQuests(address player) external view returns (uint256[] memory)",
  "function quests(uint256 questId) public view returns (uint256 id, string memory title, string memory description, uint256 experienceReward, uint256 tokenReward, uint256 target, bool active, uint256 deadline)",
  "function playerQuests(address player, uint256 questId) public view returns (uint256 questId, uint256 progress, bool completed, uint256 startTime)",
  "event QuestCreated(uint256 indexed questId, string title, uint256 reward)",
  "event QuestStarted(address indexed player, uint256 indexed questId)",
  "event QuestCompleted(address indexed player, uint256 indexed questId, uint256 reward)"
];

export const TOURNAMENT_ABI = [
  "function createTournament(string memory name, uint256 prizePool, uint256 entryFee, uint256 maxParticipants, uint256 registrationPeriod) external returns (uint256)",
  "function registerForTournament(uint256 tournamentId, uint256 characterId) external payable",
  "function createBattle(uint256 tournamentId, address player1, address player2, uint256 character1, uint256 character2) external returns (uint256)",
  "function completeBattle(uint256 battleId, address winner) external",
  "function getTournamentParticipants(uint256 tournamentId) external view returns (address[] memory)",
  "function getPlayerTournaments(address player) external view returns (uint256[] memory)",
  "function tournaments(uint256 tournamentId) public view returns (uint256 id, string memory name, uint256 prizePool, uint256 entryFee, uint256 maxParticipants, uint256 registrationDeadline, uint256 startTime, bool active)",
  "function battles(uint256 battleId) public view returns (uint256 id, uint256 tournamentId, address player1, address player2, uint256 character1, uint256 character2, address winner, bool completed, uint256 timestamp)",
  "event TournamentCreated(uint256 indexed tournamentId, string name, uint256 prizePool)",
  "event PlayerRegistered(address indexed player, uint256 indexed tournamentId)",
  "event BattleCompleted(uint256 indexed battleId, address winner, address loser)"
];