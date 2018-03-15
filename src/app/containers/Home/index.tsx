import * as React from 'react';
const style = require('./style.css');

class Home extends React.Component<any, any> {

  public state = {
    file: null,
    image: null,
  };

  public constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  public onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    this.fileUpload(this.state.file).then((response) => {
      console.log(response);
      this.setState({image: `http://localhost:8898/file/${response.file.filename}`});
    });
  }
  public onChange(e) {
    this.setState({file: e.target.files[0]});
  }
  public fileUpload(file) {
    const url = 'http://localhost:8898/upload';
    const formData = new FormData();
    formData.append('file', file);
    // const headers = {
    //         'content-type': 'multipart/form-data',
    //     };
    return fetch(url, {
      // headers,
      method: 'post',
      body: formData,
    }).then((res) => {
      return res.json();
    });
  }

  public render() {
    return (
      <div className={style.Home}>
        <img src={require('./barbar.png')} />
        <p>Hello!</p>
        <form onSubmit={this.onFormSubmit}>
          <h1>File Upload</h1>
          <input type="file" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>
        <img src={this.state.image} />
      </div>
    );
  }
}

export { Home }
