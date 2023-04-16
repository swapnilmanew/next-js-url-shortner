import Head from 'next/head';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [url, setURL] = useState('');
  const [shortened, setShortened] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(false);
  // toast code
  const showCopiedMessage = () => {
    toast.success('URL copied to Clipboard !');
  };

  // making an api call
  const shortenURL = async () => {
    try {
      if (!isValidUrl(url)) {
        toast.error('Please enter valid URL !');
        return;
      }
      setLoading(true);
      const apiCall = await fetch(
        'https://breakit.vercel.app/api/make-url-short',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            originalURL: url,
          }),
        }
      );
      const response = await apiCall.json();
      console.log(response);
      setShortened(response.shortURL);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
    function isValidUrl(inputUrl) {
      try {
        const urlObj = new URL(inputUrl);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      } catch (error) {
        return false;
      }
    }
  };
  return (
    <div>
      <Head>
        <title>Shorten Your Links - Swapnil Mane</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ"
          crossorigin="anonymous"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
      </Head>

      <div className="container my-5">
        <Toaster
          toastOptions={{
            className: '',
            style: {
              border: '1px solid black',
            },
            position: 'top-right',
          }}
        />
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <h4 className="mb-3 text-center display-3 fw-bold">
              Shorten Your Links !
            </h4>
            <div className="card shadow">
              <div className="card-body">
                <form>
                  <div className="form-group my-3">
                    <label htmlFor="longUrl" className="mb-2">
                      Enter Long URL:
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="longUrl"
                      onChange={(e) => setURL(e.target.value)}
                      placeholder="Enter long URL here..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={shortenURL}
                    className="btn btn-success btn-block shadow"
                  >
                    Shorten URL
                  </button>
                </form>
                <hr />
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status"></div>
                  </div>
                ) : shortened == null ? (
                  <></>
                ) : (
                  <div className="card">
                    <div className="p-3 d-flex justify-content-between">
                      <div>
                        <b>URL :</b> <a href={shortened}>{shortened}</a>
                      </div>
                      <CopyToClipboard
                        text={shortened}
                        onCopy={showCopiedMessage}
                      >
                        <button className="btn btn-success btn-sm">Copy</button>
                      </CopyToClipboard>
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <br />
                  <small>Developed by Swapnil Mane</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
