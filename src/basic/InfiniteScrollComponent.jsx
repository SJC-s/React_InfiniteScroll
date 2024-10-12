import { useState, useRef, useCallback, useEffect } from 'react';


export default function InfiniteScrollComponent() {
    const fileList = [
        "business.jpg",
        "marketing.jpg",
        "socialmedia.jpg",
        // 더 많은 이미지 파일 추가
    ];
    const [data, setData] = useState(fileList.slice(0, 2));
    const loader = useRef(null);   // 마지막 요소 참조

    // 스크롤할 때마다 이미지를 추가하는 함수
    const getFiles = useCallback(() => {
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
        <div className="container">
            {data.map((fileName, idx) => (
                <div
                    key={idx}
                    className="row align-items-center bg-info-subtle mb-3 p-3"
                    style={{ display: 'flex', alignItems: 'center', marginBottom:'20px' }}         // flexbox : 수직 가운데 정렬 적용
                >
                    {/* 파일 이름을 이미지 경로로 설정 : 좌측 이미지 */}
                    <div className="col-md-6 text-center">
                        <img
                            src={`/upload/${fileName}`}
                            alt={fileName}
                            className="img-fluid"
                            style={{width:'500px', maxWidth: '100%', height: 'auto' }}
                        />
                    </div>
                    {/* 우측 텍스트 */}
                    <div className="col-md-6" style={{flex: 1, textAlign: 'left', paddingLeft: '20px'}}>
                        <h5>{fileName}</h5>
                        <p>Some description about {fileName}.</p>
                    </div>
                </div>
            ))}
            <div ref={loader}/>
        </div>
    )
}