import styles from "./PokerCard.module.css";

interface PokerCardProps {
  display: string;
  isActive?: boolean;
  onClick?: () => void;
}

function PokerCard(pokerCardProps: PokerCardProps) {
  return (
    <button
      key={pokerCardProps.display}
      id={pokerCardProps.display}
      className={`${styles['poker-card']} ${pokerCardProps.isActive === false ?'': styles['slide-up']} rounded-full  h-16 w-16 sm:h-16 sm:w-16 md:h-16 md:w-16 lg:h-16 lg:w-16 px-4 py-2 font-bold m-2`}
      onClick={pokerCardProps.onClick}
    >
      {pokerCardProps.display}
    </button>
  );
}

export default PokerCard;
