import './App.css'
import InfiniteScrollComponent from "./basic/InfiniteScrollComponent.jsx";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import BulletinBoard from './basic/BulletinBoard'; // 게시판 컴포넌트

export default function App () {

    return (
        <BrowserRouter>
            <div className="App">
                {/* 헤더 메뉴 */}
                <header>
                    <nav className="navbar">
                        <ul>
                            <li>
                                <Link to="/">메인</Link> {/* 메인 페이지로 이동 */}
                            </li>
                            <li>
                                <Link to="/bulletin-board">게시판</Link> {/* 게시판 페이지로 이동 */}
                            </li>
                        </ul>
                    </nav>
                </header>

                {/* 페이지 라우팅 설정 */}
                <Routes>
                    <Route path="/" element={<InfiniteScrollComponent />} /> {/* 메인 페이지 */}
                    <Route path="/bulletin-board" element={<BulletinBoard />} /> {/* 게시판 페이지 */}
                </Routes>
            </div>
        </BrowserRouter>
    );
}
