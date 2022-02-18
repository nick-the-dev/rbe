/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Card, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import wrarLogo from "../../../assets/logo.png";

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

export default function Stake0Window() {
  const [isUnstakePending, setIsUnstakePending] = useState(false);
  const [isCheckingRewards, setIsCheckingRewards] = useState(false);
  const [isApprovePending, setIsApprovePending] = useState(false);
  const [isStakePending, setIsStakePending] = useState(false);
  const [isHarvestPending, setIsHarvestPending] = useState(false);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [amount, setAmount] = useState();
  const { account, isAuthenticated, Moralis } = useMoralis();

  useEffect(() => {
    if (account) {
      console.log(isCheckingRewards);
      if (!isCheckingRewards) {
        console.log(account);
        setInterval(function () {
          getPendingRewards();
        }, 3000);
        setIsCheckingRewards(true);
      }
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      getStakedAmount();
    }
  }, [account]);

  // useEffect(() => {
  //   if (account) {
  //     getPendingRewards();
  //   }
  // }, [account]);

  async function approve(account, amount) {
    setIsApprovePending(true);
    const amountInWei = Moralis.Units.Token(amount, "18");
    console.log(amountInWei);
    const transaction = await Moralis.executeFunction({
      contractAddress: wRarContractAddress,
      functionName: "approve",
      abi: wRarAbi,
      params: { spender: account, amount: amountInWei },
    });
    console.log(transaction);
    const confirmation = await transaction.wait();
    console.log(confirmation.status);
    if (confirmation.status === 1) {
      setIsApproved(true);
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
      params: { _pid: 0, _amount: amountInWei },
    });
    console.log(transaction);
    const confirmation = await transaction.wait();
    console.log(confirmation.status);
    if (confirmation.status === 1) {
      console.log("Staking sucessfull");
      await getStakedAmount();
      setAmount();
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
      params: { _pid: 0, _amount: amountInWei },
    });
    console.log(transaction);
    const confirmation = await transaction.wait();
    console.log(confirmation.status);
    if (confirmation.status === 1) {
      console.log("Unstaking sucessfull");
      await getStakedAmount();
      setAmount();
      setIsUnstakePending(false);
    }
  }

  async function getPendingRewards() {
    const transaction = await Moralis.executeFunction({
      contractAddress: stakingContractAddress,
      functionName: "pendingRewards",
      abi: stakingContractAbi,
      params: { _pid: 0, _user: account },
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
      params: { _pid: 0, _amount: 0 },
    });
    console.log(transaction);
    const confirmation = await transaction.wait();
    if (confirmation.status === 1) {
      console.log("Staking sucessfull");
      setIsHarvestPending(false);
    }
  }

  async function getStakedAmount() {
    const transaction = await stakingContract.methods
      .userInfo("0", account)
      .call();

    console.log(transaction);
    let amount = Moralis.Units.FromWei(transaction.amount, "18");
    console.log(amount);
    amount = Number.parseFloat(amount).toFixed(2);
    setStakedAmount(amount);
  }

  return (
    <Card
      style={styles.card}
      title={
        <div style={styles.header}>
          <div clasName="sc-logo-wrapper">
            <img src={wrarLogo} alt="wRar Logo" width="50" height="50" />
          </div>
          <div className="title-wrapper">
            <span className="title">Stake wRAR</span>
            <span className="multiplier">x1</span>
          </div>
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
            <span className="sc-info-title">wRAR Staked</span>
            <span className="sc-window-number">{stakedAmount} wRAR</span>
          </div>
        </div>
        <div className="input-wrapper">
          <span className="input-title">Type amount</span>
          <Input
            size="large"
            value={amount}
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
            disabled={false}
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
              onClick={() => approve(stakingContractAddress, amount)}
              disabled={false}
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
              disabled={false}
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
      </div>
    </Card>
  );
}
