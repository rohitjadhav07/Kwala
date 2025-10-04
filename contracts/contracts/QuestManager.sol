// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ChainQuestCharacter.sol";

/**
 * @title QuestManager
 * @dev Manages quest creation, tracking, and completion for ChainQuest
 */
contract QuestManager is Ownable {
    ChainQuestCharacter public characterContract;
    
    struct Quest {
        uint256 id;
        string title;
        string description;
        uint256 experienceReward;
        uint256 tokenReward;
        uint256 target;
        bool active;
        uint256 deadline;
    }
    
    struct PlayerQuest {
        uint256 questId;
        uint256 progress;
        bool completed;
        uint256 startTime;
    }
    
    mapping(uint256 => Quest) public quests;
    mapping(address => mapping(uint256 => PlayerQuest)) public playerQuests;
    mapping(address => uint256[]) public playerActiveQuests;
    
    uint256 public nextQuestId = 1;
    
    event QuestCreated(uint256 indexed questId, string title, uint256 reward);
    event QuestStarted(address indexed player, uint256 indexed questId);
    event QuestProgressUpdated(address indexed player, uint256 indexed questId, uint256 progress);
    event QuestCompleted(address indexed player, uint256 indexed questId, uint256 reward);
    
    constructor(address _characterContract) {
        characterContract = ChainQuestCharacter(_characterContract);
    }
    
    function createQuest(
        string memory title,
        string memory description,
        uint256 experienceReward,
        uint256 tokenReward,
        uint256 target,
        uint256 duration
    ) external onlyOwner returns (uint256) {
        uint256 questId = nextQuestId++;
        
        quests[questId] = Quest({
            id: questId,
            title: title,
            description: description,
            experienceReward: experienceReward,
            tokenReward: tokenReward,
            target: target,
            active: true,
            deadline: block.timestamp + duration
        });
        
        emit QuestCreated(questId, title, experienceReward + tokenReward);
        return questId;
    }
    
    function startQuest(uint256 questId) external {
        require(quests[questId].active, "Quest not active");
        require(quests[questId].deadline > block.timestamp, "Quest expired");
        require(!playerQuests[msg.sender][questId].completed, "Quest already completed");
        
        if (playerQuests[msg.sender][questId].startTime == 0) {
            playerQuests[msg.sender][questId] = PlayerQuest({
                questId: questId,
                progress: 0,
                completed: false,
                startTime: block.timestamp
            });
            
            playerActiveQuests[msg.sender].push(questId);
            emit QuestStarted(msg.sender, questId);
        }
    }
    
    function updateQuestProgress(address player, uint256 questId, uint256 progress) external onlyOwner {
        require(playerQuests[player][questId].startTime > 0, "Quest not started");
        require(!playerQuests[player][questId].completed, "Quest already completed");
        
        playerQuests[player][questId].progress = progress;
        emit QuestProgressUpdated(player, questId, progress);
        
        // Auto-complete if target reached
        if (progress >= quests[questId].target) {
            completeQuest(player, questId);
        }
    }
    
    function completeQuest(address player, uint256 questId) public onlyOwner {
        require(!playerQuests[player][questId].completed, "Quest already completed");
        require(playerQuests[player][questId].progress >= quests[questId].target, "Quest not completed");
        
        playerQuests[player][questId].completed = true;
        
        // Distribute rewards
        Quest memory quest = quests[questId];
        if (quest.experienceReward > 0) {
            // Add experience to player's characters
            uint256[] memory characters = characterContract.getCharactersByOwner(player);
            if (characters.length > 0) {
                characterContract.addExperience(characters[0], quest.experienceReward);
            }
        }
        
        emit QuestCompleted(player, questId, quest.experienceReward + quest.tokenReward);
    }
    
    function getPlayerActiveQuests(address player) external view returns (uint256[] memory) {
        return playerActiveQuests[player];
    }
}