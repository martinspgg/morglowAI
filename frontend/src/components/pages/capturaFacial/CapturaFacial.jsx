import './CapturaFacialModule.css'
import back from '../../../images/move-left.png'
import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'

function Captura() {
  const navigate = useNavigate()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [imagemPreview, setImagemPreview] = useState(null)
  const [cameraAberta, setCameraAberta] = useState(false)
  const [stream, setStream] = useState(null)

  async function abrirCamera() {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })

      setStream(cameraStream)
      setCameraAberta(true)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream
        }
      }, 100)

    } catch (error) {
      console.error('Erro ao abrir câmera:', error)
      alert('Não foi possível acessar a câmera.')
    }
  }

  function capturarFoto() {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imagem = canvas.toDataURL('image/png')
    setImagemPreview(imagem)

    fecharCamera()
  }

  function fecharCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }

    setStream(null)
    setCameraAberta(false)
  }

  function handleImagem(e) {
    const arquivo = e.target.files[0]

    if (!arquivo) return

    const urlImagem = URL.createObjectURL(arquivo)
    setImagemPreview(urlImagem)
  }

  function refazerFoto() {
    setImagemPreview(null)
    fecharCamera()
  }

  function confirmarContinuar() {
    navigate('/service')
  }

  return (
    <div className='CapturaContainer'>
      <div className='CapturaContent'>

        <div className='ProgressBar'>
          <span className='active'></span>
          <span className='active'></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="CapturaHeader">
          <button
            className="backView"
            onClick={() => navigate('/home')}
          >
            <img src={back} alt="Voltar" />
          </button>

          <div className="CapturaHeaderText">
            <p className="eyebrow">ATENDIMENTO • PASSO 2</p>
            <h3>Captura Facial</h3>
          </div>
        </div>

        <div className="FacePreviewBox">
          {cameraAberta ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="FacePreviewImage"
            />
          ) : imagemPreview ? (
            <img
              src={imagemPreview}
              alt="Foto selecionada"
              className="FacePreviewImage"
            />
          ) : (
            <div className="FacePlaceholder">
              <span>Posicione o rosto aqui</span>
            </div>
          )}

          <span className="corner top-left"></span>
          <span className="corner top-right"></span>
          <span className="corner bottom-left"></span>
          <span className="corner bottom-right"></span>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="CapturaCardDics">
          <h3 className='capture-tips-title'>✓ DICAS PARA MELHOR RESULTADO</h3>
          <ul>
            <li>✓ Rosto de frente, olhos abertos</li>
            <li>✓ Boa iluminação (sem sombras fortes)</li>
            <li>✓ Cabelo afastado do rosto</li>
            <li>✗ Sem boné ou óculos escuros</li>
          </ul>
        </div>

        <div className='btn-primar'>
          {cameraAberta ? (
            <>
              <button className='btn-primary' onClick={capturarFoto}>
                📸 Capturar foto
              </button>

              <button className='btn-outlin' onClick={fecharCamera}>
                Cancelar
              </button>
            </>
          ) : !imagemPreview ? (
            <>
              <button className='btn-primary' onClick={abrirCamera}>
                📷 Abrir câmera
              </button>

              <label className='btn-outlin'>
                📁 Carregar foto
                <input
                  type="file"
                  accept='image/*'
                  hidden
                  onChange={handleImagem}
                />
              </label>
            </>
          ) : (
            <>
              <button
                className='btn-primary'
                onClick={confirmarContinuar}
              >
                Confirmar e Continuar
              </button>

              <button
                className='btn-outlin'
                onClick={refazerFoto}
              >
                Refazer foto
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default Captura