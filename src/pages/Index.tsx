import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const Index = () => {
  const [getInputValue, setGetInputValue] = useState('');
  const [list, setList] = useState([]);
  const [index, setIndex] = useState(-1);
  const ref = useRef<HTMLUListElement>(null);

  //api 호출 함수
  const updateData = () => {
    if (getInputValue !== '') {
      axios
        .get('http://localhost:4000/sick', {
          params: {
            q: getInputValue,
          },
        })
        .then((res: any) => {
          setList(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  //디바운싱 (0.2초마다 실행)
  useEffect(() => {
    const debounce = setTimeout(() => {
      updateData();
    }, 200);
    return () => {
      clearTimeout(debounce);
    };
  }, [getInputValue]);

  const handleInputTxt = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGetInputValue(e.target.value);
  };

  const handleChangeEvent = (index: number) => {
    setIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const listRef = ref.current;

    if (listRef !== null) {
      const itemList = listRef.children;
      //화살표 아래키 눌렀을 때
      if (e.key === 'ArrowDown') {
        setIndex(prev => prev + 1);

        for (let i = 0; i < itemList.length; i++) {
          if (index + 1 === i) {
            listRef.children[index + 1].className = 'bg-green-50';
          } else if (index + 1 !== i) {
            listRef.children[i].className = ' ';
          }
        }
        //화살표 윗키 누를 때
      } else if (e.key === 'ArrowUp') {
        setIndex(prev => prev - 1);

        for (let i = 0; i < itemList.length; i++) {
          if (index - 1 === i) {
            listRef.children[index - 1].className = 'bg-green-50';
          } else if (index - 1 !== i) {
            listRef.children[i].className = ' ';
          }
        }
      }
    }
  };

  return (
    <div className="App">
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
        type="type"
        value={getInputValue}
        onChange={handleInputTxt}
        onKeyDown={handleKeyDown}
      />
      <ul ref={ref}>
        {list.length > 0
          ? list.map((item: any, index: number) => (
              <li
                key={item.sickCd}
                onChange={() => {
                  handleChangeEvent(index);
                }}
              >
                {item.sickNm.includes(getInputValue) && getInputValue !== '' ? (
                  <>
                    {item.sickNm.split(getInputValue)[0]}
                    <span className="font-bold">{getInputValue}</span>
                    {item.sickNm.split(getInputValue)[1]}
                  </>
                ) : (
                  item.sickNm
                )}
              </li>
            ))
          : '일치하는 검색어 없음'}
      </ul>
    </div>
  );
};

export default Index;
