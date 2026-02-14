import { Component } from 'react';
import { postMasinoppeEnnustus } from '../../Api';

class MasinoppeEnnustus extends Component {

  constructor(props) {
    super(props);
    this.state = {
      result: null,
      form: {
        text: ''
      }
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const response = await postMasinoppeEnnustus(this.state.form.text);
    const json = await response.json();
    this.setState({ result: (json.result || '').split('\n').filter(line => line !== '') });
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
                <textarea name={'text'} onChange={this.handleInputChange} value={this.state.form.text}
                          rows={10} className="form-control" id="textInput" aria-describedby="textHelp"
                          placeholder="Sisestage tekst siia" />
                <small id="textHelp" className="form-text text-muted">Tekst mida soovite analüüsida</small>
              </div>
              {this.state.result !== null && (
                <div className="form-group">
                  Päringu vastus: <br />
                  <ul>
                    {this.state.result.map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
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

export default MasinoppeEnnustus;
