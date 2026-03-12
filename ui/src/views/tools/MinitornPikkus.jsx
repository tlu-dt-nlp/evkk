import { Component } from 'react';
import { postMinitornPikkus } from '../../Api';

class MinitornPikkus extends Component {

  constructor(props) {
    super(props);
    this.state = {
      length: null,
      form: {
        text: ''
      }
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const response = await postMinitornPikkus(this.state.form.text);
    const json = await response.json();
    this.setState({ length: json.length });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const { form = {} } = this.state;
    form[name] = value;
    this.setState({ form });
  };

  render() {
    return (
      <div className={'container'}>
        <div className={'row justify-content-center'}>
          <div className={'col-lg-6'}>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="textInput">Sõne</label>
                <input name={'text'} onChange={this.handleInputChange} value={this.state.form.text}
                       type="text" className="form-control" id="textInput" aria-describedby="textHelp"
                       placeholder="Sisestage sõne siia" />
                <small id="textHelp" className="form-text text-muted">Sisestage sõne mille pikkust mõõta soovite</small>
              </div>
              {this.state.length !== null && (
                <div className="form-group">
                  <p>
                    Päringu vastus: {this.state.length}
                  </p>
                </div>
              )}
              <div>
                <button type="submit" className="btn btn-primary btn-lg btn-block">Saada päring</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default MinitornPikkus;
