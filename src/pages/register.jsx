import GoogleAuth from '../components/GoogleOath';

function Register() {
  return (
    <div className="home-container">
      <div className="practice-card modal-animate" style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="practice-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>REGISTER</h2>
        <GoogleAuth />
      </div>
    </div>
  );
}

export default Register;
