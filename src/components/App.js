import React, { Component } from 'react';
import DVideo from '../abis/DVideo.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//+-Declare IPFS:_
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  /**+-Copy-Paste Code for Using Web3 in Every React-No-Hooks App:_{-.*/
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  /**-}.*/

  async loadBlockchainData() {
    const web3 = window.web3
    //+-Load accounts:_
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    //+-Add first account the the state:_

    //+-Get network ID:_
    //+-Get network data:_
    //+-Check if net data exists, then===>:_
      //=>+-Assign dvideo contract to a variable:_
      //=>+-Add dvideo to the state:_

      //=>+-Check videoAmounts:_
      //=>+-Add videAmounts to the state:_

      //=>+-Iterate throught videos and add them to the state (by newest):_


      //=>+-Set latest video and it's title to view as default :_
      //=>+-Set loading state to false:_

      //=>+-If network data doesn't exisits, log error:_
  }

  //+-Get video:_
  captureFile = event => {

  }

  //+-Upload video:_
  uploadVideo = title => {

  }

  //+-Change Video:_
  changeVideo = (hash, title) => {

  }

  constructor(props) {
    super(props)
    //+-set states:_
    this.state = {
      loading: false,
      account: '',
    }

    //+-Bind functions:_
  }

  render() {
    return (
      <div>
        <Navbar 
          //+-Account:_
          account={this.state.account}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              //+-states&functions:_
            />
        }
      </div>
    );
  }
}

export default App;