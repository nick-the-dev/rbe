/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Card, Button, Input, notification } from "antd";
import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import Text from "antd/lib/typography/Text";
import wrarLogo from "../../../assets/logo.png";
import ftmLogo from "../../../assets/ftm-logo.png";

const wRarAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "toSummonerID",
        type: "uint256",
      },
    ],
    name: "RARGotUnwrapped",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "summonerID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RARGotWrapped",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "_Treasurer",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountToUnwrap", type: "uint256" },
      { internalType: "uint256", name: "toSummonerID", type: "uint256" },
    ],
    name: "unwrap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "summonerID", type: "uint256" },
      { internalType: "uint256", name: "amountToWrap", type: "uint256" },
    ],
    name: "wrap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const wRarContractAddress = "0x817CA23E8393Aa3E0075a40deD609684651982d7";

const wRarFtmAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0In",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1In",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
    ],
    name: "Swap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve0",
        type: "uint112",
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve1",
        type: "uint112",
      },
    ],
    name: "Sync",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINIMUM_LIQUIDITY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "burn",
    outputs: [
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "amount1", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      { internalType: "uint112", name: "_reserve0", type: "uint112" },
      { internalType: "uint112", name: "_reserve1", type: "uint112" },
      { internalType: "uint32", name: "_blockTimestampLast", type: "uint32" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token0", type: "address" },
      { internalType: "address", name: "_token1", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "kLast",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "mint",
    outputs: [{ internalType: "uint256", name: "liquidity", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "price0CumulativeLast",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "price1CumulativeLast",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "skim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount0Out", type: "uint256" },
      { internalType: "uint256", name: "amount1Out", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "swap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sync",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token0",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token1",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const wRarFtmContractAddress = "0xDd5c686e2c8a996B935C67FEf7553a25f10F076a";

const stakingContractAbi = [
  {
    inputs: [
      {
        internalType: "contract Token",
        name: "_rewardsToken",
        type: "address",
      },
      { internalType: "address", name: "_devaddr", type: "address" },
      { internalType: "uint256", name: "_rewardsPerBlock", type: "uint256" },
      { internalType: "uint256", name: "_startBlock", type: "uint256" },
      { internalType: "uint256", name: "_endBlock", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint256", name: "pid", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint256", name: "pid", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "EmergencyWithdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint256", name: "pid", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_allocPoint", type: "uint256" },
      { internalType: "contract IERC20", name: "_lpToken", type: "address" },
      { internalType: "bool", name: "_withUpdate", type: "bool" },
    ],
    name: "add",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_devaddr", type: "address" }],
    name: "dev",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "devaddr",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "endBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_from", type: "uint256" },
      { internalType: "uint256", name: "_to", type: "uint256" },
    ],
    name: "getMultiplier",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "massUpdatePools",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "pendingRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "poolInfo",
    outputs: [
      { internalType: "contract IERC20", name: "lpToken", type: "address" },
      { internalType: "uint256", name: "allocPoint", type: "uint256" },
      { internalType: "uint256", name: "lastRewardBlock", type: "uint256" },
      { internalType: "uint256", name: "accTokenPerShare", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsPerBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsToken",
    outputs: [{ internalType: "contract Token", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "uint256", name: "_allocPoint", type: "uint256" },
      { internalType: "bool", name: "_withUpdate", type: "bool" },
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAllocPoint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
    name: "updatePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "userInfo",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "rewardDebt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const stakingContractAddress = "0xa203c83f10e24Cc9a987F3DDF0D384aBaE94a242";

// Plain web3 part
const web3 = new Web3("https://rpc.ftm.tools/");
const stakingContract = new web3.eth.Contract(
  stakingContractAbi,
  stakingContractAddress,
);

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "600",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    width: "450px",
    fontSize: "16px",
    fontWeight: "500",
  },
};

export default function Stake1Window() {
  const [isUnstakePending, setIsUnstakePending] = useState(false);
  const [isCheckingRewards, setIsCheckingRewards] = useState(false);
  const [isApprovePending, setIsApprovePending] = useState(false);
  const [isStakePending, setIsStakePending] = useState(false);
  const [isHarvestPending, setIsHarvestPending] = useState(false);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [isFantomConnected, setIsFantomConnected] = useState(false);
  const [amount, setAmount] = useState();
  const { account, isAuthenticated, Moralis } = useMoralis();

  useEffect(() => {
    if (account) {
      isConnectedToFantom();
    }
  });

  useEffect(() => {
    const isFantom = isConnectedToFantom();

    if (account && isFantomConnected) {
      console.log(Moralis.getChainId());
      console.log(isCheckingRewards);
      if (!isCheckingRewards) {
        console.log(account);
        setInterval(function () {
          getPendingRewards();
        }, 3000);
        setIsCheckingRewards(true);
      }
      getStakedAmount();
    }
  }, [account, isFantomConnected]);

  // useEffect(() => {
  //   if (account) {
  //     getPendingRewards();
  //   }
  // }, [account]);

  async function isConnectedToFantom() {
    const chain = await Moralis.getChainId();
    if (chain === "0xfa") {
      setIsFantomConnected(true);
    }
  }

  async function approve(amount) {
    setIsApprovePending(amount);
    const amountInWei = Moralis.Units.Token(amount, "18");
    console.log(amountInWei);
    const transaction = await Moralis.executeFunction({
      contractAddress: wRarFtmContractAddress,
      functionName: "approve",
      abi: wRarFtmAbi,
      params: { spender: stakingContractAddress, value: amountInWei },
    });
    console.log(transaction);
    const confirmation = await transaction.wait();
    console.log(confirmation.status);
    if (confirmation.status === 1) {
      setIsApproved(true);
      openSuccessNotification("Approve Successful!");
      setIsApprovePending(false);
    }
  }

  async function stake(amount) {
    setIsStakePending(true);
    const amountInWei = Moralis.Units.Token(amount, "18");
    const transaction = await Moralis.executeFunction({
      contractAddress: stakingContractAddress,
      functionName: "deposit",
      abi: stakingContractAbi,
      params: { _pid: 1, _amount: amountInWei },
    });
    console.log(transaction);
    const confirmation = await transaction.wait();
    console.log(confirmation.status);
    if (confirmation.status === 1) {
      await getStakedAmount();
      setAmount();
      openSuccessNotification("Stake Successful!");
      setIsStakePending(false);
    }
  }

  async function unstake(amount) {
    setIsUnstakePending(true);
    const amountInWei = Moralis.Units.Token(amount, "18");
    console.log(amountInWei);
    const transaction = await Moralis.executeFunction({
      contractAddress: stakingContractAddress,
      functionName: "withdraw",
      abi: stakingContractAbi,
      params: { _pid: 1, _amount: amountInWei },
    });
    console.log(transaction);
    const confirmation = await transaction.wait();
    console.log(confirmation.status);
    if (confirmation.status === 1) {
      await getStakedAmount();
      setAmount();
      openSuccessNotification("Unstake Successful!");
      setIsUnstakePending(false);
    }
  }

  async function getPendingRewards() {
    const transaction = await Moralis.executeFunction({
      contractAddress: stakingContractAddress,
      functionName: "pendingRewards",
      abi: stakingContractAbi,
      params: { _pid: 1, _user: account },
    });
    let rewards = Moralis.Units.FromWei(transaction, "18");
    rewards = Number.parseFloat(rewards).toFixed(2);
    setPendingRewards(rewards);
  }

  async function harvest() {
    setIsHarvestPending(true);
    const transaction = await Moralis.executeFunction({
      contractAddress: stakingContractAddress,
      functionName: "withdraw",
      abi: stakingContractAbi,
      params: { _pid: 1, _amount: 0 },
    });
    console.log(transaction);
    const confirmation = await transaction.wait();
    if (confirmation.status === 1) {
      openSuccessNotification("Harvest Successful!");
      setIsHarvestPending(false);
    }
  }

  async function getStakedAmount() {
    const transaction = await stakingContract.methods
      .userInfo("1", account)
      .call();

    console.log(transaction);
    let amount = Moralis.Units.FromWei(transaction.amount, "18");
    console.log(amount);
    amount = Number.parseFloat(amount).toFixed(2);
    setStakedAmount(amount);
  }

  const openSuccessNotification = (message) => {
    const args = {
      message: message,
      description: "",
      duration: 10,
    };
    notification.open(args);
  };

  return (
    <Card
      style={styles.card}
      title={
        <div style={styles.header}>
          <div className="sc-logo-wrapper">
            <img src={wrarLogo} alt="wRar Logo" width="50" height="50" />
            <img src={ftmLogo} alt="FTM Logo" width="50" height="50" />
          </div>
          <div className="title-wrapper">
            <span className="title">Stake wRAR-FTM LP</span>
            <span className="multiplier">x3</span>
          </div>
          <Text style={{ display: "block" }}>
            You can add liquidity to wRAR-FTM pair on {""}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://spookyswap.finance/add/FTM/0x817CA23E8393Aa3E0075a40deD609684651982d7"
            >
              SpookySwap
            </a>
          </Text>
        </div>
      }
    >
      <div className="sc-body">
        <div className="sc-info-windows">
          <div className="sc-info-window">
            <span className="sc-info-title">RBE Reward</span>
            <span className="sc-window-number">{pendingRewards} RBE</span>
          </div>
          <div className="sc-info-window">
            <span className="sc-info-title">wRAR/FTM Staked</span>
            <span className="sc-window-number">{stakedAmount} wRAR/FTM</span>
          </div>
        </div>
        <div className="input-wrapper">
          <Input
            size="large"
            value={amount}
            disabled={!isAuthenticated}
            type="number"
            placeholder="0.0"
            onChange={(e) => {
              setAmount(`${e.target.value}`);
            }}
          />
        </div>
        <div className="sc-buttons">
          <Button
            type="primary"
            size="large"
            loading={isUnstakePending}
            style={{
              width: "49%",
              marginTop: "25px",
              marginLeft: "0.5%",
              marginRight: "0.5%",
            }}
            onClick={() => unstake(amount)}
            disabled={!amount || !isFantomConnected}
          >
            Unstake
          </Button>
          {!isApproved && (
            <Button
              type="primary"
              size="large"
              loading={isApprovePending}
              style={{
                width: "49%",
                marginTop: "25px",
                marginLeft: "0.5%",
                marginRight: "0.5%",
              }}
              onClick={() => approve(amount)}
              disabled={!amount || !isFantomConnected}
            >
              Approve
            </Button>
          )}
          {isApproved && (
            <Button
              type="primary"
              size="large"
              loading={isStakePending}
              style={{
                width: "49%",
                marginTop: "25px",
                marginLeft: "0.5%",
                marginRight: "0.5%",
              }}
              onClick={() => stake(amount)}
              disabled={!amount || !isFantomConnected}
            >
              Stake
            </Button>
          )}
        </div>
        {pendingRewards > 0 && (
          <Button
            className="sc-harvest-btn"
            type="primary"
            size="large"
            loading={isHarvestPending}
            style={{
              width: "100%",
              marginTop: "25px",
              marginLeft: "0.5%",
              marginRight: "0.5%",
            }}
            onClick={() => harvest()}
            disabled={false}
          >
            Harvest RBE
          </Button>
        )}
        {!isFantomConnected && (
          <span className="warning">
            Wrong network. You should change to Fantom
          </span>
        )}
      </div>
    </Card>
  );
}
