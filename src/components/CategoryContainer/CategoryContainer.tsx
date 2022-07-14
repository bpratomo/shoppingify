import styles from "./CategoryContainer.module.css";
import { ItemType } from "./../../features/item/itemSlice";
import Item from "../Item";
interface CategoryContainerProps {
  category: string;
  items: ItemType[];
  activateItemDesc: (i: ItemType) => void;
}
export default function CategoryContainer(props: CategoryContainerProps) {
  return (
    <section className={styles.category__container}>
      <h3 className={styles.category__header}>{props.category}</h3>
      <div className={styles.category__items}>
        {props.items
          .filter((i) => i.category === props.category)
          .map((i) => (
            <Item
              item={i}
              key={i.id}
              activateItemDesc={props.activateItemDesc}
            />
          ))}
      </div>
    </section>
  );
}
