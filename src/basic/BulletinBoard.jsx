import { useState, useEffect } from 'react';

// 게시글 더미 데이터 (예시)
const posts = Array.from({ length: 100 }, (_, i) => ({
    postId: i + 1,
    title: `게시글 ${i + 1}`,
    category: i % 2 === 0 ? '문의' : '의뢰',
    status: i % 3 === 0 ? 'OPEN' : 'CLOSED',
    createdAt: `2023-10-${String(i % 30).padStart(2, '0')}`
}));

const MAX_PAGES_DISPLAY = 10; // 최대 페이지네이션 버튼 수

export default function BulletinBoard() {
    const [filteredPosts, setFilteredPosts] = useState(posts);  // 필터링된 게시글 리스트
    const [activeTab, setActiveTab] = useState('전체');         // 현재 활성화된 탭
    const [searchQuery, setSearchQuery] = useState('');         // 검색어 상태
    const [currentPage, setCurrentPage] = useState(1);          // 현재 페이지 상태

    const postsPerPage = 5;                                   // 한 페이지에 보여줄 게시글 수
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage); // 총 페이지 수

    // 탭이나 검색어가 변경될 때마다 필터링 처리
    useEffect(() => {
        handleSearch();
    }, [activeTab, searchQuery]);

    // 카테고리와 검색어 필터링 처리 함수
    const handleSearch = () => {
        const filtered = posts.filter(post => {
            return (activeTab === '전체' || post.category === activeTab) &&
                post.title.toLowerCase().includes(searchQuery.toLowerCase()); // 제목 검색 필터
        });
        setFilteredPosts(filtered);
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    // 탭 변경 함수
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        handleSearch(); // 탭이 변경될 때 검색 필터링 실행
    };

    // 엔터 키 입력 감지 함수
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // 엔터 키 입력 시 검색 실행
        }
    };

    // 현재 페이지에 해당하는 게시글 가져오기
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);


    // 페이지 이동 처리 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 페이지네이션 버튼을 동적으로 생성하는 함수
    const getPageNumbers = () => {
        let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGES_DISPLAY / 2));
        let endPage = Math.min(startPage + MAX_PAGES_DISPLAY - 1, totalPages);

        startPage = endPage === totalPages ? endPage-MAX_PAGES_DISPLAY+1 : startPage;
        return Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);
    };


    return (
        <div className="container">
            {/* 검색 창 및 탭 메뉴 - 가로로 나란히 배치 */}
            <div className="header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                {/* 탭 메뉴 */}
                <div className="tabs">
                    <button onClick={() => handleTabChange('전체')} className={activeTab === '전체' ? 'active' : ''}>
                        전체
                    </button>
                    <button onClick={() => handleTabChange('문의')} className={activeTab === '문의' ? 'active' : ''}>
                        문의
                    </button>
                    <button onClick={() => handleTabChange('의뢰')} className={activeTab === '의뢰' ? 'active' : ''}>
                        의뢰
                    </button>
                </div>
                {/* 검색 창 - 우측 상단에 위치 */}
                <div className="search-bar" style={{textAlign: 'right', marginBottom: '10px'}}>
                    <input
                        type="text"
                        placeholder="게시글 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{padding: '5px 10px', width: '300px'}}
                    />
                    <button onClick={handleSearch} style={{marginLeft: '10px', padding: '5px 10px'}}>
                        검색
                    </button>
                </div>
            </div>

            {/* 게시판 테이블 리스트 */}
            <table className="post-table" style={{width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>제목</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>카테고리</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>상태</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>작성일</th>
                </tr>
                </thead>
                <tbody>
                {currentPosts.length > 0 ? (
                    currentPosts.map(post => (
                        <tr key={post.postId}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.title}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.category}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.status}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.createdAt}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                            게시글이 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
                    {getPageNumbers().map(pageNumber => (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            style={{
                                margin: '0 5px',
                                padding: '5px 10px',
                                backgroundColor: currentPage === pageNumber ? '#007bff' : '#f0f0f0',
                                color: currentPage === pageNumber ? 'white' : 'black',
                                border: '1px solid #ccc',
                                cursor: 'pointer'
                            }}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
            )}

        </div>
    );
}
