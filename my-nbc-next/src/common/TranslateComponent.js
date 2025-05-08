import React, { useEffect, useRef } from 'react';

const TranslateComponent = () => {
    const googleTranslateRef = useRef(null);

    useEffect(() => {
        let intervalId;

        const checkGoogleTranslate = () => {
            if (window.google && window.google.translate) {
                clearInterval(intervalId);
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        includedLanguages: "en,hi,pa"
                    },
                    googleTranslateRef.current
                );
            }
        };

        intervalId = setInterval(checkGoogleTranslate, 100);
    }, []);

    return (
        <div>
            <div className='select-translate' ref={googleTranslateRef}></div>
        </div>
    )
}

export default TranslateComponent;