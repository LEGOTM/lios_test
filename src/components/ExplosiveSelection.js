import React, { useState, useEffect, useCallback} from 'react';
import ExplosiveCard from './ExplosiveCard';
import MaterialSelection from './MaterialSelection';
import WoodenBuildSelection from './WoodenBuildSelection';
import StoneBuildSelection from './StoneBuildSelection';
import MetalBuildSelection from './MetalBuildSelection';
import SteelBuildSelection from './SteelBuildSelection';
import TitanBuildSelection from './TitanBuildSelection';
import ObjectBuildSelection from './ObjectBuildSelection';
import './ExplosiveSelection.css';

const tg = window.Telegram.WebApp;

const explosives = [
  { name: "Бобовка", imagePath: "/images/bb.png" },
  { name: "Динамит", imagePath: "/images/tnt.png" },
  { name: "Военная С4 взрывчатка", imagePath: "/images/c4.png" },
  { name: "Гексоген", imagePath: "/images/geks.png" },
  { name: "Простая ракета", imagePath: "/images/simplerocket.png" },
  { name: "Ракета", imagePath: "/images/rocket.png" },
  { name: "Граната", imagePath: "/images/granade.png" },
  { name: "Граната из сплава", imagePath: "/images/granadewith.png" },
  {name:"Ракета РСЗО", imagePath:"/images/rocketrszo.png"}
];
const sulfurData = {
  "Бобовка": 120,
  "Динамит": 500,
  "Военная С4 взрывчатка": 1500,
  "Гексоген":2500,
  "Простая ракета":150,
  "Ракета":1500,
  "Граната": 150,
  "Граната из сплава":600,
  "Ракета РСЗО":200,
  // Добавьте остальные виды взрывчатки
};
const explosiveData = {
  "Бобовка": {
    "Дерево": { "Дверь": 2, "Стена": 4, "Фундамент": 15 },
    "Камень": { "Дверь": 3, "Стена": 10, "Фундамент": 40 },
    "Металл": { "Дверь": 30, "Стена": 100, "Фундамент": 400,"Железная складная лестница":46,"Железная решётка":"Невозможно"},
    "Отличное железо":{"Дверь": 200, "Стена": 667, "Фундамент": 2667, "Складная лестница":275,"Решётка":"Невозможно"},
    "Титан":{"Дверь": 800, "Стена": 2667, "Фундамент": "Невозможно", "Складная лестница":1112,"Решётка":"Невозможно"},
    "Объекты":{"Устройство отслеживания стрельбы":50,"Установка с автоматической винтовкой":50,"Автоматическая установка для картечи":50,"Торговый бот":668,"Электромагнитная турель":50,"Ракетная пусковая установка":50},
  },
  "Динамит": {
    "Дерево": { "Дверь": 1, "Стена": 2, "Фундамент": 8 },
    "Камень": { "Дверь": 2, "Стена": 5, "Фундамент": 20 },
    "Металл": { "Дверь": 4, "Стена": 13, "Фундамент": 50, "Железная складная лестница":7,"Железная решётка":"Невозможно"},
    "Отличное железо":{"Дверь": 20, "Стена": 67, "Фундамент": 267, "Складная лестница":28,"Решётка":"Невозможно"},
    "Титан":{"Дверь": 80, "Стена": 200, "Фундамент": 800, "Складная лестница":112,"Решётка":"Невозможно"},
    "Объекты":{"Устройство отслеживания стрельбы":7,"Установка с автоматической винтовкой":7,"Автоматическая установка для картечи":7,"Торговый бот":68,"Электромагнитная турель":7,"Ракетная пусковая установка":7},
  },
  "Военная С4 взрывчатка":{
    "Дерево": { "Дверь": 1, "Стена": 2, "Фундамент": 5 },
    "Камень": { "Дверь": 1, "Стена": 4, "Фундамент": 13 },
    "Металл": { "Дверь": 2, "Стена": 6, "Фундамент": 24,"Железная складная лестница":3,"Железная решётка":"Невозможно"},
    "Отличное железо":{"Дверь": 4, "Стена": 13, "Фундамент": 49, "Складная лестница":6,"Решётка":"Невозможно"},
    "Титан":{"Дверь": 14, "Стена": 34, "Фундамент": 136, "Складная лестница":15,"Решётка":"Невозможно"},
    "Объекты":{"Устройство отслеживания стрельбы":3,"Установка с автоматической винтовкой":3,"Автоматическая установка для картечи":3,"Торговый бот":13,"Электромагнитная турель":3,"Ракетная пусковая установка":3},
  },
  "Гексоген":{
    "Дерево": { "Дверь": 1, "Стена": 1, "Фундамент": 2 },
    "Камень": { "Дверь": 1, "Стена": 2, "Фундамент": 6 },
    "Металл": { "Дверь": 1, "Стена": 3, "Фундамент": 10,"Железная складная лестница":1,"Железная решётка":3 },
    "Отличное железо":{"Дверь": 2, "Стена": 6, "Фундамент": 17, "Складная лестница":3,"Решётка":6},
    "Титан":{"Дверь": 4, "Стена": 10, "Фундамент": 40, "Складная лестница":6,"Решётка":"Невозможно"},
    "Объекты":{"Устройство отслеживания стрельбы":2,"Установка с автоматической винтовкой":2,"Автоматическая установка для картечи":2,"Торговый бот":6,"Электромагнитная турель":2,"Ракетная пусковая установка":2},
  },
  "Простая ракета":{
    "Дерево": { "Дверь": 2, "Стена": 6, "Фундамент": 22 },
    "Камень": { "Дверь": 5, "Стена": 16, "Фундамент": 61 },
    "Металл": { "Дверь": 9, "Стена": 30, "Фундамент": 120,"Железная складная лестница":15,"Железная решётка":30 },
    "Отличное железо":{"Дверь": 93, "Стена": 308, "Фундамент": 1231, "Складная лестница":156,"Решётка":156},
    "Титан":{"Дверь": 400, "Стена": "Невозможно", "Фундамент": "Невозможно", "Складная лестница":"Невозможно","Решётка":"Невозможно"},
    "Объекты":{"Устройство отслеживания стрельбы":"Невозможно","Установка с автоматической винтовкой":"Невозможно","Автоматическая установка для картечи":"Невозможно","Торговый бот":"Невозможно","Электромагнитная турель":"Невозможно","Ракетная пусковая установка":"Невозможно"},
  },
  "Ракета":{
    "Дерево": { "Дверь": 1, "Стена": 2, "Фундамент": 5 },
    "Камень": { "Дверь": 1, "Стена": 4, "Фундамент": 13 },
    "Металл": { "Дверь": 2, "Стена": 6, "Фундамент": 24,"Железная складная лестница":3,"Железная решётка":3 },
    "Отличное железо":{"Дверь": 4, "Стена": 13, "Фундамент": 49, "Складная лестница":6,"Решётка":6},
    "Титан":{"Дверь": 14, "Стена": 34, "Фундамент": 136, "Складная лестница":15,"Решётка":19},
    "Объекты":{"Устройство отслеживания стрельбы":3,"Установка с автоматической винтовкой":3,"Автоматическая установка для картечи":3,"Торговый бот":13,"Электромагнитная турель":3,"Ракетная пусковая установка":3},
  },
  "Граната":{
    "Дерево": { "Дверь": 2, "Стена": 6, "Фундамент": 22 },
    "Камень": { "Дверь": 5, "Стена": 16, "Фундамент": 61 },
    "Металл": { "Дверь": 9, "Стена": 30, "Фундамент": 120,"Железная складная лестница":15,"Железная решётка":15 },
    "Отличное железо":{"Дверь": 19, "Стена": 61, "Фундамент": 251, "Складная лестница":31,"Решётка":26},
    "Титан":{"Дверь": 64, "Стена": "Невозможно", "Фундамент": "Невозможно", "Складная лестница":"Невозможно","Решётка":"Невозможно"},
    "Объекты":{"Устройство отслеживания стрельбы":15,"Установка с автоматической винтовкой":15,"Автоматическая установка для картечи":15,"Торговый бот":80,"Электромагнитная турель":15,"Ракетная пусковая установка":15},
  },
  "Граната из сплава":{
    "Дерево": { "Дверь": 2, "Стена": 4, "Фундамент": 15 },
    "Камень": { "Дверь": 4, "Стена": 12, "Фундамент": 45 },
    "Металл": { "Дверь": 6, "Стена": 19, "Фундамент": 75,"Железная складная лестница":10,"Железная решётка":10 },
    "Отличное железо":{"Дверь": 12, "Стена": 40, "Фундамент": 160, "Складная лестница":20,"Решётка":17},
    "Титан":{"Дверь": 30, "Стена": 75, "Фундамент": 292, "Складная лестница":41,"Решётка":"Невозможно"},
    "Объекты":{"Устройство отслеживания стрельбы":10,"Установка с автоматической винтовкой":10,"Автоматическая установка для картечи":10,"Торговый бот":39,"Электромагнитная турель":10,"Ракетная пусковая установка":10},
  },
  "Ракета РСЗО":{
    "Дерево": { "Дверь":"Не целесообразно", "Стена": 6, "Фундамент": 24 },
    "Камень": { "Дверь": "Не целесообразно", "Стена": 12, "Фундамент": 42 },
    "Металл": { "Дверь": "Не целесообразно", "Стена": 23, "Фундамент": 98,"Железная складная лестница":"Не целесообразно","Железная решётка":"Не целесообразно" },
    "Отличное железо":{"Дверь": "Не целесообразно", "Стена": 65, "Фундамент": 270, "Складная лестница":20,"Решётка":17},
    "Титан":{"Дверь": "Не целесообразно", "Стена": 70, "Фундамент": 351, "Складная лестница":"Не целесообразно","Решётка":"Невозможно"},
    "Объекты":{"Устройство отслеживания стрельбы":"Не целесообразно","Установка с автоматической винтовкой":"Не целесообразно","Автоматическая установка для картечи":"Не целесообразно","Торговый бот":"Не целесообразно","Электромагнитная турель":"Не целесообразно","Ракетная пусковая установка":"Не целесообразно"},
  }
  // добавьте остальные виды взрывчатки
};


const ExplosiveSelection = ({ setStep }) => {
  const [selectedExplosive, setSelectedExplosive] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedBuildType, setSelectedBuildType] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [step, localSetStep] = useState(1); // 1: Выбор взрывчатки, 2: Выбор материала, 3: Выбор типа постройки, 4: Результат

  useEffect(() => {
    setStep(step); // Передаем состояние шага в App

    // Инициализация кнопок Telegram Web App
    tg.expand(); // Расширить Web App
    tg.setHeaderColor('#007bff'); // Установить цвет заголовка
  }, [step, setStep]);

  const handleTryAgain = useCallback(() => {
    // Сброс состояния и скрытие кнопки
    localSetStep(1);
    setSelectedExplosive(null);
    setSelectedMaterial(null);
    setSelectedBuildType(null);
    setQuantity(0);
    tg.MainButton.hide();
    tg.MainButton.offClick(handleTryAgain);
  }, []);

  useEffect(() => {
    if (step === 4) {
      tg.MainButton.text = "Попробовать снова";
      tg.MainButton.onClick(handleTryAgain);
      tg.MainButton.show();

      tg.BackButton.hide();
      return () => {
        tg.MainButton.offClick(handleTryAgain);
      };
    }
  }, [step, handleTryAgain]);

  const handleSelectExplosive = (name) => {
    setSelectedExplosive(name);
    tg.MainButton.text = "Далее";
    tg.MainButton.show();
    tg.MainButton.offClick(handleNextStep); // Очищаем предыдущий обработчик
    tg.MainButton.onClick(handleNextStep);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedExplosive) {
      localSetStep(2);
      tg.MainButton.hide();
    } else if (step === 2 && selectedMaterial) {
      localSetStep(3);
      tg.MainButton.hide();
    }
  };

  const handleSelectMaterial = (name) => {
    setSelectedMaterial(name);
    tg.MainButton.text = "Далее";
    tg.MainButton.show();
    tg.MainButton.offClick(handleNextStep); // Очищаем предыдущий обработчик
    tg.MainButton.onClick(handleNextStep);
  };

  const handleSelectBuildType = (name, quantity) => {
    setSelectedBuildType(name);
    setQuantity(quantity);
    localSetStep(4); // Переход к следующему шагу сразу после выбора типа постройки и количества
  };

  const calculateExplosiveNeeded = () => {
    if (selectedExplosive && selectedMaterial && selectedBuildType) {
      const buildData = explosiveData[selectedExplosive][selectedMaterial];
      const requiredAmount = buildData[selectedBuildType];
      if (requiredAmount === "Невозможно") {
        return { amount: "Невозможно", sulfur: "Невозможно" };
      }
      if (requiredAmount === "Не целесообразно") {
        return { amount: "Не целесообразно", sulfur: "Не целесообразно" };
      }
      const totalAmount = requiredAmount * quantity;
      const sulfurAmount = sulfurData[selectedExplosive] * totalAmount;
      return { amount: totalAmount, sulfur: sulfurAmount };
    }
    return { amount: 0, sulfur: 0 };
  };

  const formatResultText = () => {
    const { amount, sulfur } = calculateExplosiveNeeded();
    const explosive = selectedExplosive;

    if (amount === "Невозможно") {
      return (
        <strong>
          Невозможно разрушить выбранный фундамент из титана данной взрывчаткой.
        </strong>
      );
    }

    if (amount === "Не целесообразно") {
      return (
        <strong>
          Не целесообразно использовать выбранную взрывчатку для разрушения данного объекта.
        </strong>
      );
    }

    return (
      <>
        Вам потребуется: <span className="highlight-text">{amount}</span> <span className="highlight-text">{explosive}</span><br />
        <br />
        Серы: <span className="highlight-text">{sulfur}</span>
      </>
    );
  };

  return (
    <div className="App">
      {step === 1 ? (
        <div>
          <div className="explosive-grid">
            {explosives.map(({ name, imagePath }) => (
              <ExplosiveCard
                key={name}
                name={name}
                imagePath={imagePath}
                selected={selectedExplosive === name}
                onClick={() => handleSelectExplosive(name)}
              />
            ))}
          </div>
        </div>
      ) : step === 2 ? (
        <div>
          <MaterialSelection onSelectMaterial={handleSelectMaterial} />
        </div>
      ) : step === 3 ? (
        <div>
          {selectedMaterial === "Дерево" && (
            <WoodenBuildSelection onSelectBuildType={handleSelectBuildType} />
          )}
          {selectedMaterial === "Камень" && (
            <StoneBuildSelection onSelectBuildType={handleSelectBuildType} />
          )}
          {selectedMaterial === "Металл" && (
            <MetalBuildSelection onSelectBuildType={handleSelectBuildType} />
          )}
          {selectedMaterial === "Отличное железо" && (
            <SteelBuildSelection onSelectBuildType={handleSelectBuildType} />
          )}
          {selectedMaterial === "Титан" && (
            <TitanBuildSelection onSelectBuildType={handleSelectBuildType} />
          )}
          {selectedMaterial === "Объекты" && (
            <ObjectBuildSelection onSelectBuildType={handleSelectBuildType} />
          )}
        </div>
      ) : step === 4 ? (
        <div>
          <p>
            {formatResultText()}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ExplosiveSelection;