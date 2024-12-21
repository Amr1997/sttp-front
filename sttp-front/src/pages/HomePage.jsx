import React, { useState, useRef } from 'react';
import { Layout, Upload, Button, Typography, Spin, message } from 'antd';
import { UploadOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';  // Import the logout action
import { useTranscribeAudioMutation } from '../api/audioApi';
import { useNavigate } from 'react-router-dom';
const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [wordIndex, setWordIndex] = useState(null);
  const [transcribeAudio, { isLoading }] = useTranscribeAudioMutation();
  const audioRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const dispatch = useDispatch(); // Initialize useDispatch hook

  // Handle file upload
  const handleFileChange = (info) => {
    const uploadedFile = info.file.originFileObj || info.file;

    if (!uploadedFile) {
      message.error('Failed to upload the file. Please try again.');
      return;
    }

    if (uploadedFile.type !== 'audio/wav') {
      message.error('Please upload a .wav file.');
      return;
    }

    setFile(uploadedFile);
    setAudioUrl(URL.createObjectURL(uploadedFile)); // Set audio URL for playback
    message.success('File uploaded successfully!');
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks = [];
      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioUrl(URL.createObjectURL(audioBlob));
        setFile(audioBlob); // Set the file state for transcription
      };
      
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      message.error('Unable to start recording. Please check your microphone.');
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  // Handle transcription
  const handleTranscribe = async () => {
    if (!file) {
      message.error('Please upload or record an audio file first!');
      return;
    }

    const formData = new FormData();
    formData.append('audio_file', file);

    try {
      const response = await transcribeAudio(formData).unwrap();
      setTranscription(response.transcribed_text.json || {});
    } catch (error) {
      message.error('Failed to transcribe audio. Please try again.');
    }
  };

  // Handle audio time update to sync transcription
  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    setCurrentTime(current);

    // Find word index for current time
    const wordIdx = transcription?.words?.findIndex(
      (word) => current >= word.start && current <= word.end
    );
    setWordIndex(wordIdx);
  };

  // Highlight current word
  const renderTranscription = () => {
    if (!transcription || !transcription.words) return null;
    return transcription.words.map((word, idx) => (
      <span
        key={idx}
        style={{
          backgroundColor: idx === wordIndex ? 'yellow' : 'transparent',
        }}
      >
        {word.text}{' '}
      </span>
    ));
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());  // Dispatch the logout action
    message.success('Logged out successfully');
    navigate('/login');  // Navigate to the login page
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#001529' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'white', fontSize: '20px' }}>SSTP Service</div>
          <Button icon={<LogoutOutlined />} onClick={handleLogout} style={{ color: 'white' }}>
            Logout
          </Button>
        </div>
      </Header>
      
      <Content style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <Title level={2}>Audio Transcription</Title>

        {/* File upload section */}
        <Upload
          beforeUpload={() => false}
          onChange={handleFileChange}
          maxCount={1}
          accept=".wav"
        >
          <Button icon={<UploadOutlined />}>Upload Audio</Button>
        </Upload>

        {/* Record audio section */}
        <div style={{ marginTop: '10px' }}>
          <Button onClick={isRecording ? stopRecording : startRecording} type="primary">
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </div>

        {/* Transcription button */}
        <Button
          type="primary"
          onClick={handleTranscribe}
          disabled={!file || isLoading}
          style={{ marginTop: '10px' }}
        >
          {isLoading ? <Spin /> : 'Transcribe'}
        </Button>

        {/* Transcription display */}
        {transcription && (
          <div style={{ marginTop: '20px' }}>
            <Title level={4}>Transcription:</Title>
            <Paragraph>{renderTranscription()}</Paragraph>
          </div>
        )}

        {/* Audio playback section */}
        {audioUrl && (
          <div style={{ marginTop: '20px' }}>
            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              onTimeUpdate={handleTimeUpdate}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default HomePage;
