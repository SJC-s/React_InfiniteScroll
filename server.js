import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import * as fs from "node:fs";

const app = express();
const port = 5173;

// ES 모듈 환경에서 __dirname을 대체하는 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS 설정 (필요 시)
app.use(cors());

// 정적 파일 서빙
app.use('/images', express.static(path.join(__dirname, 'public/upload')));

// 파일 목록을 제공하는 API
app.get('/api/files', (req, res) => {
    const directoryPath = path.join(__dirname, 'public/upload');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }

        res.json(files); // JSON으로 파일 목록 반환
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
