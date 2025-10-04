// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ChainQuestCharacter.sol";

/**
 * @title TournamentManager
 * @dev Manages tournament creation, registration, and battle execution
 */
contract TournamentManager is Ownable {
    ChainQuestCharacter public characterContract;
    
    struct Tournament {
        uint256 id;
        string name;
        uint256 prizePool;
        uint256 entryFee;
        uint256 maxParticipants;
        uint256 registrationDeadline;
        uint256 startTime;
        bool active;
        address[] participants;
        mapping(address => bool) registered;
    }
    
    struct Battle {
        uint256 id;
        uint256 tournamentId;
        address player1;
        address player2;
        uint256 character1;
        uint256 character2;
        address winner;
        bool completed;
        uint256 timestamp;
    }
    
    mapping(uint256 => Tournament) public tournaments;
    mapping(uint256 => Battle) public battles;
    mapping(address => uint256[]) public playerTournaments;
    
    uint256 public nextTournamentId = 1;
    uint256 public nextBattleId = 1;
    
    event TournamentCreated(uint256 indexed tournamentId, string name, uint256 prizePool);
    event PlayerRegistered(address indexed player, uint256 indexed tournamentId);
    event BattleCreated(uint256 indexed battleId, address player1, address player2);
    event BattleCompleted(uint256 indexed battleId, address winner, address loser);
    event TournamentCompleted(uint256 indexed tournamentId, address winner);
    
    constructor(address _characterContract) {
        characterContract = ChainQuestCharacter(_characterContract);
    }
    
    function createTournament(
        string memory name,
        uint256 prizePool,
        uint256 entryFee,
        uint256 maxParticipants,
        uint256 registrationPeriod
    ) external onlyOwner returns (uint256) {
        uint256 tournamentId = nextTournamentId++;
        
        Tournament storage tournament = tournaments[tournamentId];
        tournament.id = tournamentId;
        tournament.name = name;
        tournament.prizePool = prizePool;
        tournament.entryFee = entryFee;
        tournament.maxParticipants = maxParticipants;
        tournament.registrationDeadline = block.timestamp + registrationPeriod;
        tournament.startTime = block.timestamp + registrationPeriod + 1 hours;
        tournament.active = true;
        
        emit TournamentCreated(tournamentId, name, prizePool);
        return tournamentId;
    }
    
    function registerForTournament(uint256 tournamentId, uint256 characterId) external payable {
        Tournament storage tournament = tournaments[tournamentId];
        
        require(tournament.active, "Tournament not active");
        require(block.timestamp < tournament.registrationDeadline, "Registration closed");
        require(!tournament.registered[msg.sender], "Already registered");
        require(tournament.participants.length < tournament.maxParticipants, "Tournament full");
        require(msg.value >= tournament.entryFee, "Insufficient entry fee");
        require(characterContract.ownerOf(characterId) == msg.sender, "Not character owner");
        
        tournament.registered[msg.sender] = true;
        tournament.participants.push(msg.sender);
        playerTournaments[msg.sender].push(tournamentId);
        
        emit PlayerRegistered(msg.sender, tournamentId);
    }
    
    function createBattle(
        uint256 tournamentId,
        address player1,
        address player2,
        uint256 character1,
        uint256 character2
    ) external onlyOwner returns (uint256) {
        require(tournaments[tournamentId].registered[player1], "Player1 not registered");
        require(tournaments[tournamentId].registered[player2], "Player2 not registered");
        
        uint256 battleId = nextBattleId++;
        
        battles[battleId] = Battle({
            id: battleId,
            tournamentId: tournamentId,
            player1: player1,
            player2: player2,
            character1: character1,
            character2: character2,
            winner: address(0),
            completed: false,
            timestamp: block.timestamp
        });
        
        emit BattleCreated(battleId, player1, player2);
        return battleId;
    }
    
    function completeBattle(uint256 battleId, address winner) external onlyOwner {
        Battle storage battle = battles[battleId];
        require(!battle.completed, "Battle already completed");
        require(winner == battle.player1 || winner == battle.player2, "Invalid winner");
        
        battle.winner = winner;
        battle.completed = true;
        
        address loser = winner == battle.player1 ? battle.player2 : battle.player1;
        uint256 winnerCharacter = winner == battle.player1 ? battle.character1 : battle.character2;
        
        // Award experience to winner
        characterContract.addExperience(winnerCharacter, 100);
        
        emit BattleCompleted(battleId, winner, loser);
    }
    
    function getTournamentParticipants(uint256 tournamentId) external view returns (address[] memory) {
        return tournaments[tournamentId].participants;
    }
    
    function getPlayerTournaments(address player) external view returns (uint256[] memory) {
        return playerTournaments[player];
    }
}