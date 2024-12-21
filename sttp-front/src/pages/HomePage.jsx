import React, { useState, useRef } from 'react';
import { Upload, Button, Typography, Spin, message, Input } from 'antd';
import { UploadOutlined, AudioOutlined } from '@ant-design/icons';
import { useTranscribeAudioMutation } from '../api/audioApi';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [transcribeAudio, { isLoading }] = useTranscribeAudioMutation();
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const handleFileChange = (info) => {
    console.log('File info:', info);

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
    setAudioUrl(URL.createObjectURL(uploadedFile)); // Set URL for playback
    message.success('File uploaded successfully!');
  };

  const handleTranscribe = async () => {
    if (!file) {
      message.error('Please upload an audio file first!');
      return;
    }

    const formData = new FormData();
    formData.append('audio_file', file);

    try {
      const response = await transcribeAudio(formData).unwrap();
      setTranscription(response.transcribed_text || 'No transcription found.');
    } catch (error) {
      message.error('Failed to transcribe audio. Please try again.');
    }
  };

  const startRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }

    setAudioChunks([]);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      setAudioChunks((prevChunks) => [...prevChunks, event.data]);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      setFile(audioBlob);
      setAudioUrl(URL.createObjectURL(audioBlob)); // Set the recorded audio for playback
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Title level={2}>Audio Transcription</Title>

      <Upload
        beforeUpload={() => false} // Prevent auto upload
        onChange={handleFileChange}
        maxCount={1}
        accept=".wav"
      >
        <Button icon={<UploadOutlined />}>Upload Audio</Button>
      </Upload>

      <Button
        type="primary"
        onClick={handleTranscribe}
        disabled={!file || isLoading}
        style={{ marginTop: '10px' }}
      >
        {isLoading ? <Spin /> : 'Transcribe'}
      </Button>

      <Button
        type="default"
        onClick={startRecording}
        style={{ marginTop: '10px' }}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>

      {audioUrl && (
        <div style={{ marginTop: '20px' }}>
          <audio ref={audioRef} src={audioUrl} controls />
          <Button onClick={playAudio} style={{ marginTop: '10px' }} icon={<AudioOutlined />}>
            Play Audio
          </Button>
        </div>
      )}

      {transcription && (
        <div style={{ marginTop: '20px' }}>
          <Title level={4}>Transcription:</Title>
          <Paragraph>{transcription}</Paragraph>
        </div>
      )}
    </div>
  );
};

export default HomePage;
