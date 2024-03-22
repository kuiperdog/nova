export const ABI_JSON = [
    {
        "type": "event",
        "anonymous": false,
        "name": "Finalized",
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "burned",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Initialized",
        "inputs": [
            {
                "type": "uint8",
                "name": "version",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PollCreated",
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Revealed",
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "revealedVotes",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "remainingVotes",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RoleAdminChanged",
        "inputs": [
            {
                "type": "bytes32",
                "name": "role",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "previousAdminRole",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "newAdminRole",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RoleGranted",
        "inputs": [
            {
                "type": "bytes32",
                "name": "role",
                "indexed": true
            },
            {
                "type": "address",
                "name": "account",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RoleRevoked",
        "inputs": [
            {
                "type": "bytes32",
                "name": "role",
                "indexed": true
            },
            {
                "type": "address",
                "name": "account",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Voted",
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "voteIndex",
                "indexed": false
            },
            {
                "type": "address",
                "name": "voter",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "comoAmount",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "hash",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "DEFAULT_ADMIN_ROLE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "OPERATOR_ROLE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "candidates",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId"
            }
        ],
        "outputs": [
            {
                "type": "string[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "comoContract",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "createPoll",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "title_"
            },
            {
                "type": "string[]",
                "name": "candidates_"
            },
            {
                "type": "uint256",
                "name": "startAt_"
            },
            {
                "type": "uint256",
                "name": "due_"
            },
            {
                "type": "uint256",
                "name": "minimumCOMO_"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "finalize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getRoleAdmin",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            }
        ],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "grantRole",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "hasRole",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "hashes",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": ""
            },
            {
                "type": "bytes32",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "voteSignerAddress_"
            },
            {
                "type": "address",
                "name": "comoAddress_"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "isInProgress",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "isRevealedVote",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": ""
            },
            {
                "type": "uint256",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "pollResult",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId"
            }
        ],
        "outputs": [
            {
                "type": "tuple[]",
                "name": "",
                "components": [
                    {
                        "type": "string",
                        "name": "candidate"
                    },
                    {
                        "type": "uint256",
                        "name": "votes"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "polls",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "string",
                "name": "title"
            },
            {
                "type": "uint256",
                "name": "startAt"
            },
            {
                "type": "uint256",
                "name": "due"
            },
            {
                "type": "uint256",
                "name": "minimumCOMO"
            },
            {
                "type": "uint256",
                "name": "totalVotedCOMO"
            },
            {
                "type": "uint256",
                "name": "revealedVotes"
            },
            {
                "type": "bool",
                "name": "finalized"
            }
        ]
    },
    {
        "type": "function",
        "name": "remainingVotes",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "renounceRole",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "reset",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId"
            },
            {
                "type": "uint256",
                "name": "missingOffset"
            },
            {
                "type": "tuple[]",
                "name": "missingCommitData",
                "components": [
                    {
                        "type": "uint256",
                        "name": "comoAmount"
                    },
                    {
                        "type": "bytes32",
                        "name": "hash"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "reveal",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId"
            },
            {
                "type": "tuple[]",
                "name": "data",
                "components": [
                    {
                        "type": "uint256",
                        "name": "votedCandidateId"
                    },
                    {
                        "type": "bytes32",
                        "name": "salt"
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "offset"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "revokeRole",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setVoteSignerAddress",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "addr"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes4",
                "name": "interfaceId"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "tokensReceived",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "operator"
            },
            {
                "type": "address",
                "name": "from"
            },
            {
                "type": "address",
                "name": "to"
            },
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "bytes",
                "name": "userData"
            },
            {
                "type": "bytes",
                "name": "operatorData"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "totalVotes",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "userVoteResults",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": ""
            },
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "uint256",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "voteSignerAddress",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "voters",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": ""
            },
            {
                "type": "uint256",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "votes",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId"
            }
        ],
        "outputs": [
            {
                "type": "tuple[]",
                "name": "",
                "components": [
                    {
                        "type": "uint256",
                        "name": "comoAmount"
                    },
                    {
                        "type": "bytes32",
                        "name": "hash"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "votesPerCandidates",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "pollId"
            }
        ],
        "outputs": [
            {
                "type": "uint256[]",
                "name": ""
            }
        ]
    }
]
