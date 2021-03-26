import React, { Component } from "react";
import DVideo from "../abis/DVideo.json";
import Navbar from "./Navbar";
import Main from "./Main";
import Web3 from "web3";
import "./App.css";

//+-Declare IPFS:_
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
}); //(leaving out the arguments will default to these values).

class App extends Component {
  /**+-Copy-Paste Code for Using Web3 in Every React-No-Hooks App:_{-.*/
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }
  /**-}.*/

  async loadBlockchainData() {
    const web3 = window.web3;
    //+-Load accounts:_
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    //+-Add first account the the state:_

    //+-Get network ID:_
    const networkId = await web3.eth.net.getId();
    //+-Get network data:_
    const networkData = DVideo.networks[networkId];

    //+-Check if net data exists, then===>:_
    if (networkData) {
      //=>+-Assign dvideo contract to a variable:_
      const dvideo = new web3.eth.Contract(DVideo.abi, networkData.address);
      //=>+-Add dvideo to the state:_
      this.setState({ dvideo });

      //=>+-Check videoAmounts:_
      const videosCount = await dvideo.methods.videoCount().call();
      //=>+-Add videAmounts to the state:_
      this.setState({ videosCount });

      //=>+-Iterate throught videos and add them to the state (by newest):_
      for (var i = videosCount; i >= 1; i--) {
        const video = await dvideo.methods.videos(i).call();
        this.setState({
          videos: [...this.state.videos, video],
        });
      }

      //=>+-Set latest video and it's title to view as default :_
      const latest = await dvideo.methods.videos(videosCount).call();
      this.setState({
        currentHash: latest.hash,
        currentTitle: latest.title,
      });
      //=>+-Set loading state to false:_
      this.setState({ loading: false });
    } else {
      //=>+-If network data doesn't exisits, log error:_
      window.alert("DVideo contract not deployed to detected network.");
    }
  }

  //+-Get video(Preparing the File to be Uploaded to I.P.F.S):_
  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };

  //+-Upload video:_
  uploadVideo = (title) => {
    console.log("Submitting file to I.P.F.S...");

    //+-Adding file to I.P.F.S:_
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("IPFS result", result);
      if (error) {
        console.error(error);
        return;
      }
      //+-Put it on Blockchain:_
      this.setState({ loading: true });
      this.state.dvideo.methods
        .uploadVideo(result[0].hash, title)
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
          this.setState({ loading: false });
        });
    });
  };

  //+-Change Video:_
  changeVideo = (hash, title) => {
    this.setState({ currentHash: hash });
    this.setState({ currentTitle: title });
  };

  constructor(props) {
    super(props);
    //+-set states:_
    this.state = {
      account: "",
      dvideo: null,
      videos: [],
      loading: true,
      currentHash: null,
      currentTitle: null,
    };

    //+-Bind functions:_
  }

  render() {
    return (
      <div>
        <Navbar
          //+-Account:_
          account={this.state.account}
        />
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <Main
            //+-states&functions:_
            videos={this.state.videos}
            uploadVideo={this.uploadVideo}
            captureFile={this.captureFile}
            changeVideo={this.changeVideo}
            currentHash={this.state.currentHash}
            currentTitle={this.state.currentTitle}
          />
        )}
      </div>
    );
  }
}

export default App;
