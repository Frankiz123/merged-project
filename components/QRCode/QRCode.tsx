import React, { useEffect, useRef, useState } from 'react';

import download from 'downloadjs';
import { Divider, Popover } from '@mui/material';

import ActionButton from '@components/ActionButton';
import { generateQRCode, generateQRCodeSvg } from '@utils/links';

import styles from './qrcode.module.scss';

const DownloadIcon = '/images/download.svg';

interface QRCodeGeneratorProps {
  url: string | undefined;
  shortUrl: string | undefined;
  id: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url = '', shortUrl = '', id }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [qrCodeImage, setQRCodeImage] = useState<string | null | undefined>(url);
  const [showOption, setShowOption] = useState<boolean>(false);

  useEffect(() => {
    setQRCodeImage(url);
  }, [url]);

  const handleSelectPng = (): void => {
    setShowOption(false);
    void downloadQRCode('png');
  };

  const handleSelectSvg = (): void => {
    setShowOption(false);
    void downloadQRCode('svg');
  };

  const downloadQRCode = async (type: string): Promise<number> => {
    if (type === 'png') {
      const qrRes = await generateQRCode(shortUrl);
      const downloadLink = document.createElement('a');
      downloadLink.href = qrRes;
      downloadLink.download = `${id}.${type}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      return 0;
    }
    const qrRes = await generateQRCodeSvg(shortUrl);
    download(qrRes, `${id}.svg`, 'image/svg+xml');
    return 0;
  };

  const handleDownload = (): void => {
    setShowOption(true);
  };

  const handleClose = (): void => {
    setShowOption(false);
  };

  return (
    <div className={styles.container}>
      {qrCodeImage && (
        <>
          <img src={qrCodeImage} className={styles.image} alt='QR Code' />
          <div ref={ref}>
            <ActionButton
              buttonLabel='Download'
              onClick={handleDownload}
              className={styles.downloadButton}
              startIcon={<img src={DownloadIcon} />}
            />
            <Popover
              id={id}
              open={showOption}
              anchorEl={ref.current}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              classes={{ paper: styles.popover }}>
              <ActionButton buttonLabel='Download PNG' onClick={handleSelectPng} className={styles.downloadButton1} />
              <Divider />
              <ActionButton buttonLabel='Download SVG' onClick={handleSelectSvg} className={styles.downloadButton1} />
            </Popover>
          </div>
        </>
      )}
    </div>
  );
};

export default QRCodeGenerator;
