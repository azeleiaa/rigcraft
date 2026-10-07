import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { StoreIcon } from '../../storefront/StorefrontUI'

export default function Auth() {
  const isRegister = useLocation().pathname === '/daftar'
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [notice, setNotice] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (isRegister && formData.get('password') !== formData.get('passwordConfirmation')) {
      setNotice('Konfirmasi password belum sama.')
      return
    }
    setNotice(isRegister ? 'Akun demo berhasil dibuat. Selamat datang di RigCraft!' : 'Login demo berhasil. Selamat datang kembali!')
    window.setTimeout(() => navigate('/'), 1200)
  }

  return (
    <div className="sf-auth-page"><section className="sf-auth-visual"><img src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1500&q=90" alt="PC gaming dengan pencahayaan RGB" /><div className="sf-auth-visual-content"><span className="sf-pill"><StoreIcon name="spark" /> Smart PC Builder Indonesia</span><h1>{isRegister ? <>Dari wishlist menjadi <em>rig impian.</em></> : <>Lanjutkan rakitanmu. <em>Lebih cepat.</em></>}</h1><p>{isRegister ? 'Buat profil dan nikmati pengalaman merakit PC yang lebih personal, transparan, dan bebas khawatir soal kompatibilitas.' : 'Masuk untuk menyimpan konfigurasi PC, melacak pesanan, dan melanjutkan simulasi kompatibilitas dari perangkat mana pun.'}</p><div className="sf-auth-benefits"><div><StoreIcon name="shield" /><span><strong>Data rakitan tersimpan aman</strong><small>Konfigurasi dan riwayat pesanan tetap tersinkron.</small></span></div><div><StoreIcon name="support" /><span><strong>Konsultasi ahli tanpa batas</strong><small>Tim teknisi siap membantu memilih komponen terbaik.</small></span></div></div><div className="sf-auth-proof"><span className="sf-proof-avatars"><i>R</i><i>G</i><i>C</i></span><span><strong>4.9/5 dari 2.400+ pelanggan</strong><small>Dipercaya gamer & kreator seluruh Indonesia</small></span></div></div></section>
      <section className="sf-auth-panel"><span className="sf-eyebrow">{isRegister ? 'MULAI PERJALANANMU' : 'SELAMAT DATANG KEMBALI'}</span><h2>{isRegister ? 'Buat akun RigCraft' : 'Masuk ke akun RigCraft'}</h2><p>{isRegister ? 'Gratis, cepat, dan siap menyimpan rakitan pertamamu.' : 'Akses rakitan tersimpan, pesanan, dan benefit membermu.'}</p><div className="sf-social-auth"><button type="button" onClick={() => setNotice('Login Google belum diaktifkan pada demo ini.')}><b>G</b> Lanjut dengan Google</button><button type="button" onClick={() => setNotice('Login Apple belum diaktifkan pada demo ini.')}><b>●</b> Lanjut dengan Apple</button></div><div className="sf-auth-divider"><span>Atau</span></div><form onSubmit={submit} className="sf-auth-form">{isRegister && <label>Nama lengkap<div className="sf-auth-input"><StoreIcon name="support" /><input required autoComplete="name" placeholder="Nama sesuai identitas" /></div></label>}<label>Email<div className="sf-auth-input"><StoreIcon name="mail" /><input type="email" required autoComplete="email" placeholder="nama@email.com" /></div></label><label>Password<div className="sf-auth-input"><StoreIcon name="lock" /><input name="password" type={showPassword ? 'text' : 'password'} required autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={8} placeholder={isRegister ? 'Minimal 8 karakter' : 'Masukkan password'} /><button type="button" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} onClick={() => setShowPassword((visible) => !visible)}><StoreIcon name="eye" /></button></div></label>{isRegister && <label>Konfirmasi password<div className="sf-auth-input"><StoreIcon name="lock" /><input name="passwordConfirmation" type={showPassword ? 'text' : 'password'} required minLength={8} placeholder="Ulangi password" /></div></label>}<div className="sf-auth-options"><label><input type="checkbox" required={isRegister} checked={remember} onChange={(event) => setRemember(event.target.checked)} /> {isRegister ? 'Saya menyetujui Syarat Layanan dan Kebijakan Privasi RigCraft.' : 'Ingat saya'}</label>{!isRegister && <button type="button" onClick={() => setNotice('Tautan reset password demo akan dikirim ke email Anda.')}>Lupa password?</button>}</div><button className="sf-button sf-auth-submit" type="submit">{isRegister ? 'Buat Akun' : 'Masuk'} <StoreIcon name="arrow" /></button>{notice && <p className="sf-form-notice" role="status">{notice}</p>}</form><p className="sf-auth-switch">{isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} <Link to={isRegister ? '/masuk' : '/daftar'}>{isRegister ? 'Masuk di sini' : 'Daftar gratis'}</Link></p></section></div>
  )
}