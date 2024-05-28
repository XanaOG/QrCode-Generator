import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box } from '@mui/material';
import { SketchPicker } from 'react-color';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';

export default function QRCodeForm() {
    const [url, setUrl] = useState('');
    const [color1, setColor1] = useState('#000000'); // Foreground color
    const [color2, setColor2] = useState('#FFFFFF'); // Background color
    const [gradientColor1, setGradientColor1] = useState('#000000');
    const [gradientColor2, setGradientColor2] = useState('#FFFFFF');
    const [showPicker1, setShowPicker1] = useState(false);
    const [showPicker2, setShowPicker2] = useState(false);
    const [style, setStyle] = useState('normal');
    const [qrCodeData, setQrCodeData] = useState(null);
    const [error, setError] = useState('');
    const qrCanvasRef = useRef(null);

    const pickerRef1 = useRef(null);
    const pickerRef2 = useRef(null);

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
        if (error) setError('');
    };

    const handleColor1Change = (color) => {
        if (style === 'gradient') {
            setGradientColor1(color.hex);
        } else {
            setColor1(color.hex);
        }
    };

    const handleColor2Change = (color) => {
        if (style === 'gradient') {
            setGradientColor2(color.hex);
        } else {
            setColor2(color.hex);
        }
    };

    const handleStyleChange = (event) => {
        setStyle(event.target.value);
        setShowPicker1(false);
        setShowPicker2(false);
    };

    const togglePicker1 = () => {
        if (showPicker2) setShowPicker2(false); // Optionally close the other picker if open
        setShowPicker1(!showPicker1);
    };

    const togglePicker2 = () => {
        if (showPicker1) setShowPicker1(false); // Optionally close the other picker if open
        setShowPicker2(!showPicker2);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef1.current && !pickerRef1.current.contains(event.target)) {
                setShowPicker1(false);
            }
            if (pickerRef2.current && !pickerRef2.current.contains(event.target)) {
                setShowPicker2(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (qrCodeData && style === 'gradient') {
            const canvas = qrCanvasRef.current;
            const context = canvas.getContext('2d');
            const size = 290;

            // Create gradient
            const gradient = context.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, gradientColor1);
            gradient.addColorStop(1, gradientColor2);

            // Draw gradient background
            context.fillStyle = gradient;
            context.fillRect(0, 0, size, size);

            // Draw QR code on top with transparency
            const qrCodeCanvas = document.getElementById('qrCodeCanvas');
            const qrCodeContext = qrCodeCanvas.getContext('2d');
            const imageData = qrCodeContext.getImageData(0, 0, size, size);

            context.putImageData(imageData, 0, 0);
        }
    }, [qrCodeData, gradientColor1, gradientColor2, style]);

    const generateQRCode = () => {
        if (!url) {
            setError('Please enter a valid URL.');
            return;
        }
        if (style === 'gradient') {
            setQrCodeData({
                url,
                color1: gradientColor1,
                color2: gradientColor2,
                style
            });
        } else {
            setQrCodeData({
                url,
                color1: style === 'normal' ? '#000000' : color1,
                color2: style === 'normal' ? '#FFFFFF' : color2,
                style
            });
        }
    };

    const downloadQRCode = () => {
        const canvas = qrCanvasRef.current;
        canvas.toBlob((blob) => {
            saveAs(blob, "qrcode.png");
        });
    };

    return (
        <Box sx={{ padding: 2, maxWidth: 500, margin: 'auto', backgroundColor: '#333', borderRadius: 2, boxShadow: 3 }}>
            <TextField
                fullWidth
                label="URL"
                variant="outlined"
                value={url}
                onChange={handleUrlChange}
                sx={{ mb: 2, bgcolor: 'background.paper' }}
                error={!!error}
                helperText={error}
            />
            <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend" sx={{ color: 'text.primary' }}>Style</FormLabel>
                <RadioGroup row value={style} onChange={handleStyleChange}>
                    <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                    <FormControlLabel value="color" control={<Radio />} label="Color" />
                    <FormControlLabel value="gradient" control={<Radio />} label="Gradient" />
                </RadioGroup>
            </FormControl>
            <Box display="flex" justifyContent="space-between" mb={2} flexWrap="wrap">
                {(style === 'color' || style === 'gradient') && (
                    <Box flex={1} mr={0.5} sx={{ position: 'relative' }}>
                        <Button variant="outlined" fullWidth onClick={togglePicker1} sx={{ mb: 1 }}>
                            {style === 'gradient' ? 'Gradient Color 1' : 'Foreground Color'}
                        </Button>
                        {showPicker1 && (
                            <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 'auto', zIndex: 1 }} ref={pickerRef1}>
                                <SketchPicker color={style === 'gradient' ? gradientColor1 : color1} onChangeComplete={handleColor1Change} />
                            </Box>
                        )}
                    </Box>
                )}
                {(style === 'color' || style === 'gradient') && (
                    <Box flex={1} ml={0.5} sx={{ position: 'relative' }}>
                        <Button variant="outlined" fullWidth onClick={togglePicker2} sx={{ mb: 1 }}>
                            {style === 'gradient' ? 'Gradient Color 2' : 'Background Color'}
                        </Button>
                        {showPicker2 && (
                            <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 'auto', zIndex: 1 }} ref={pickerRef2}>
                                <SketchPicker color={style === 'gradient' ? gradientColor2 : color2} onChangeComplete={handleColor2Change} />
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
            <Button variant="contained" onClick={generateQRCode} fullWidth sx={{ mb: 2 }}>Generate QR Code</Button>
            {qrCodeData && (
                <Box display="flex" justifyContent="space-around" mb={2}>
                    <Button variant="contained" onClick={generateQRCode}>Regenerate QR Code</Button>
                    <Button variant="contained" onClick={downloadQRCode}>Download QR Code</Button>
                </Box>
            )}
            {qrCodeData && (
                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <canvas ref={qrCanvasRef} width={290} height={290} />
                    <div id="qrCode" style={{ display: 'none' }}>
                        <QRCode
                            value={qrCodeData.url}
                            size={290}
                            level={"H"}
                            includeMargin={true}
                            renderAs="canvas"
                            id="qrCodeCanvas"
                        />
                    </div>
                </Box>
            )}
        </Box>
    );
}
