import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { BrowserRouter as Router } from "react-router-dom";
import Account from "components/Account/Account";
import { Layout, notification } from "antd";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import Text from "antd/lib/typography/Text";
import Staking from "components/Staking";
import logo from "assets/logo.png";
const { Header } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#202137",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 20px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = () => {
  const {
    account,
    isWeb3Enabled,
    enableWeb3,
    isAuthenticated,
    isWeb3EnableLoading,
    Moralis,
  } = useMoralis();
  // eslint-disable-next-line no-unused-vars
  const [isFantomConnected, setIsFantomConnected] = useState(false);

  const openWalletWarning = () => {
    const args = {
      message: "Wallet is not connected",
      description: "",
      duration: 10,
    };
    notification.open(args);
  };

  const openWrongNetworkWarning = () => {
    const args = {
      message: "Wrong network!",
      description:
        "You should change network to Fantom in order to use the app",
      duration: 10,
    };
    notification.open(args);
  };

  async function isConnectedToFantom() {
    const connectorId = window.localStorage.getItem("connectorId");
    if (connectorId) {
      const chain = await Moralis.getChainId();
      console.log(chain);
      if (chain === "0xfa") {
        console.log("TRUEEEEEEEE");
        setIsFantomConnected(true);
      } else {
        openWrongNetworkWarning();
        switchNetworkToFantom();
      }
    }
  }

  async function switchNetworkToFantom() {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xfa" }],
    });
  }

  useEffect(() => {
    if (account) {
      isConnectedToFantom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    setTimeout(() => {
      if (!connectorId) {
        openWalletWarning();
      }
    }, 2000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!isAuthenticated, !isWeb3Enabled]);

  // useEffect(() => {
  //   isConnectedToFantom();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     const connectorId = window.localStorage.getItem("connectorId");
  //     if (!isFantomConnected && connectorId) {
  //       console.log(isFantomConnected);
  //       openWrongNetworkWarning();
  //     }
  //   }, 3000);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Layout style={{ overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <img className="header-logo" src={logo} alt="Logo" />
          <div style={styles.headerRight}>
            <NativeBalance />
            <Account />
          </div>
        </Header>

        <div className="main" style={styles.content}>
          <div className="staking">
            <div className="heading-wrapper">
              <h1 className="title">
                Stánbryg PVP. Stage 0 PVP on the way to Rarity Metaworld
              </h1>
              <h2 className="subtitle">
                Stake wRAR, wRAR/FTM LP, or RBE/FTM LP to earn as much RBE as
                possible
              </h2>
            </div>
            <div style={{ paddingBottom: "30px" }}>
              <Text style={{ display: "block" }}>
                💰 Buy wRAR{" "}
                <a
                  href="https://www.dextools.io/app/fantom/pair-explorer/0xdd5c686e2c8a996b935c67fef7553a25f10f076a"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                , if you don't have yet
              </Text>

              <Text style={{ display: "block" }}>
                🙋 You have questions? Ask them in our {""}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://t.me/rarityrar"
                >
                  TG group
                </a>
              </Text>
            </div>
            <div className="staking-wrapper">
              <Staking />
            </div>
          </div>
        </div>
      </Router>
    </Layout>
  );
};

export default App;
