import React, {useState, useRef} from "react";
import './MovieRow.css';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

export default ({title, items}) => {
    const [scrollX, setScrollX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const listRef = useRef(null);

    const handleLeftArrow = () => {
        let x = scrollX + Math.round(window.innerWidth / 2);
        if(x > 0){
            x = 0;
        }
        setScrollX(x);
    }

    const handleRightArrow = () => {
        let x = scrollX - Math.round(window.innerWidth / 2);
        let listW = items.results.length * 200;
        if(window.innerWidth - listW > x) {
            x = (window.innerWidth - listW) - 60;
        }
        setScrollX(x);
    }

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - listRef.current.offsetLeft);
        setScrollLeft(scrollX);
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - listRef.current.offsetLeft;
        const walk = (startX - x) * 2;
        let newScrollX = scrollLeft + walk;
        
        // Limites do scroll
        let listW = items.results.length * 200;
        if (newScrollX > 0) {
            newScrollX = 0;
        } else if (window.innerWidth - listW > newScrollX) {
            newScrollX = (window.innerWidth - listW) - 60;
        }
        
        setScrollX(newScrollX);
    }

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - listRef.current.offsetLeft);
        setScrollLeft(scrollX);
    }

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - listRef.current.offsetLeft;
        const walk = (startX - x) * 2;
        let newScrollX = scrollLeft + walk;
        
        // Limites do scroll
        let listW = items.results.length * 200;
        if (newScrollX > 0) {
            newScrollX = 0;
        } else if (window.innerWidth - listW > newScrollX) {
            newScrollX = (window.innerWidth - listW) - 60;
        }
        
        setScrollX(newScrollX);
    }

    return (
        <div className="movieRow">
            <div className="movieRow--title">
                <div className="movieRow--title--texto">
                    <h2>{title}</h2>
                </div>
                <div className="movieRow--linha">
                    <hr className="linha-laranja"/> 
                </div>
            </div>
            <div className="movieRow--left" onClick={handleLeftArrow}>
                <KeyboardDoubleArrowLeftIcon style={{fontSize: 50}}/>
            </div>
            <div className="movieRow--right" onClick={handleRightArrow}>
                <KeyboardDoubleArrowRightIcon style={{fontSize: 50}}/>
            </div>

            <div className="movieRow--listarea">
                <div 
                    className="movieRow--list" 
                    ref={listRef}
                    style={{
                        marginLeft: scrollX,
                        width: items.results.length * 200,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                >
                    {items.results.map((item,key)=>(
                        <div className="movieRow--item" key={key}>
                            <img 
                                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} 
                                alt={item.title || item.original_title}
                                draggable="false"
                            />
                        </div>
                    ))}  
                </div>
            </div>
        </div>
    );
}