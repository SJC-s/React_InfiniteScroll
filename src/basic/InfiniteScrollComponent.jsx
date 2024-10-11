import React, { useState, useRef, useCallback, useEffect } from 'react';

export default function InfiniteScrollComponent() {
    const fileList = [
        "business.jpg",
        "marketing.jpg",
        "socialmedia.jpg",
        // 더 많은 이미지 파일 추가
    ];
    const [data, setData] = useState(fileList.slice(0, 2));
    const loader = useRef(null);

    // 스크롤할 때마다 이미지를 추가하는 함수
    const getFiles = useCallback((prev) => {
        setData((prev) => {
            const nextIndex = prev.length;
            return [...prev, fileList[nextIndex % fileList.length]]; // 새로운 이미지를 추가
        });
    }, [fileList]);

    // IntersectionObserver가 loader에 도달했을 때 이벤트
    const handleObserver = useCallback(
        (entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                getFiles(); // 새로운 파일 목록을 가져옴
            }
        },
        [getFiles]
    );

    // IntersectionObserver 설정 (스크롤 감지)
    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0,
        };
        const observer = new IntersectionObserver(handleObserver, option);

        if (loader.current) observer.observe(loader.current);
        return () => observer.disconnect();
    }, [handleObserver]);

    return (
        <div className="box">
            {data.map((fileName, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                    {/* 파일 이름을 이미지 경로로 설정 */}
                    <img
                        src={`/upload/${fileName}`}
                        alt={fileName}
                        width="600"
                        style={{ marginBottom: '20px' }}
                    />
                    <p>{fileName}</p> {/* 파일 이름 출력 */}
                </div>
            ))}
            <div ref={loader} />
        </div>
    );
}




/* App 백업
const [data, setData] = useState([]);  // 데이터를 저장할 상태
    const [page, setPage] = useState(1);   // 페이지 번호 상태
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태

    const observerRef = useRef(null); // 스크롤을 감지할 옵저버
    const lastElementRef = useRef(null); // 마지막 요소 참조

    useEffect(() => {
        fetchData(); // 컴포넌트 마운트 시 초기 데이터 로드
    }, [page]);

    const fetchData = async () => {
        setIsLoading(true);
        const response = await fetch(`https://your-api.com/data?page=${page}`);
        const newData = await response.json();
        setData(prevData => [...prevData, ...newData]); // 이전 데이터에 새로운 데이터 추가
        setIsLoading(false);
    };

    // IntersectionObserver 설정
    useEffect(() => {
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => prevPage + 1); // 새로운 페이지 요청
            }
        });
        if (lastElementRef.current) {
            observerRef.current.observe(lastElementRef.current);
        }
        return () => {
            if (lastElementRef.current) {
                observerRef.current.unobserve(lastElementRef.current);
            }
        };
    }, []);

    return (
        <div>
            {data.map((item, index) => (
                <div key={index} style={{ margin: '20px 0' }}>
                    <img src={item.imageUrl} alt="이미지" width="100%" />
                    <p>{item.text}</p>
                </div>
            ))}
            <div ref={lastElementRef}></div>
{isLoading && <p>로딩 중...</p>}
</div>
);

*/