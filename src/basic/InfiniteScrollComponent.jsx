import { useState, useRef, useCallback, useEffect } from 'react';


export default function InfiniteScrollComponent() {
    const fileList = [
        "business.jpg",
        "marketing.jpg",
        "socialmedia.jpg",
        // 더 많은 이미지 파일 추가
    ];
    const [data, setData] = useState(fileList);
    const [isLoading, setIsLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(2); // 현재 표시할 데이터의 인덱스 (처음 2개를 표시)
    const loader = useRef(null);
    const [showLoadMore, setShowLoadMore] = useState(false); // 더보기 버튼 표시 여부
    const [lastIndex, setLastIndex] = useState(5); // 더보기 버튼 이전에 보여줄 항목의 수

    // 스크롤할 때마다 이미지를 추가하는 함수
    const getFiles = useCallback(() => {
        if (isLoading) return; // 로딩 중이면 함수 실행 중단
        setIsLoading(true);

        if (currentIndex < lastIndex) {
            setData((prev) => {
                const nextIndex = prev.length;
                return [...prev, fileList[nextIndex % fileList.length]]; // 새로운 이미지를 추가
            });
            setCurrentIndex(data.length); // 인덱스 업데이트
        } else if (currentIndex === lastIndex) {
            setShowLoadMore(true); // 3번째 항목까지 로드되면 더보기 버튼 표시
        } else {
            setShowLoadMore(false); // 모든 파일을 불러오면 더보기 버튼 숨김
        }
        setIsLoading(false); // 로딩 완료
    }, [currentIndex, data.length, fileList, isLoading]);

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

    // "더보기" 버튼을 눌렀을 때 파일을 하나씩 불러오는 함수
    const handleLoadMore = () => {
        getFiles(); // 새로운 파일 목록을 가져옴
        setLastIndex(lastIndex+3)
    };


    return (
        <div className="container">
            {data.map((fileName, idx) => (
                <div
                    key={idx}
                    className="row align-items-center bg-info-subtle mb-3 p-3"
                    style={{ display: 'flex', alignItems: 'center', marginBottom:'20px' }}         // flexbox : 수직 가운데 정렬 적용
                >
                    {/* 파일 이름을 이미지 경로로 설정 : 좌측 이미지 */}
                    {/* 홀수 인덱스는 좌측에 이미지 */}
                    {idx % 2 === 0 ? (
                        <>
                            <div className="col-md-6 text-center">
                                <img
                                    src={`/upload/${fileName}`}
                                    alt={fileName}
                                    className="img-fluid"
                                    style={{width:'500px', maxWidth: '100%', height: 'auto' }}
                                />
                            </div>
                            <div className="col-md-6" style={{flex: 1, textAlign: 'left', paddingLeft: '20px'}}>
                                <h5>{fileName}</h5>
                                <p>Some description about {fileName}.</p>
                            </div>
                        </>
                    ) : (
                        // 짝수 인덱스는 우측에 이미지
                        <>
                            <div className="col-md-6" style={{flex: 1, textAlign: 'left', paddingRight: '20px'}}>
                                <h5>{fileName}</h5>
                                <p>Some description about {fileName}.</p>
                            </div>
                            <div className="col-md-6 text-center">
                                <img
                                    src={`/upload/${fileName}`}
                                    alt={fileName}
                                    className="img-fluid"
                                    style={{width:'500px', maxWidth: '100%', height: 'auto' }}
                                />
                            </div>
                        </>
                    )}
                </div>
            ))}
            {/* 스크롤의 끝에 도달하면 이 요소가 관찰됨 */}
            <div ref={loader}/>

            {/* 더보기 버튼 */}
            {showLoadMore && (
                <button onClick={handleLoadMore} style={{ marginTop: '20px' }}>
                    더보기
                </button>
            )}
        </div>
    )
}