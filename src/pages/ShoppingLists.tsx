import React, { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  getShoppingLists,
  setActiveList,
  ShoppingListType,
} from "../features/shoppingList/shoppingListSlice";
import styles from "./ShoppingLists.module.css";

interface ShoppingListsProps {}

export const ShoppingLists: FC<ShoppingListsProps> = (props) => {
  const shoppingLists = useAppSelector(getShoppingLists);
  const [months, setMonth] = useState<string[]>();

  useEffect(() => {
    if (shoppingLists.length > 0) {
      let formatted = shoppingLists
        .map((s) => new Date(s.createdDate))
        .map((d) =>
          d.toLocaleDateString("en-us", { month: "long", year: "numeric" })
        );
      const distinctDates = [...new Set(formatted)];
      setMonth(distinctDates);
      console.log(formatted);
    }
  }, [shoppingLists]);

  return (
    <div className={styles.base}>
      <section>
        <h1>Shopping History</h1>
      </section>
      {months
        ? months.map((m) => (
            <MonthContainer
              monthString={m}
              relevantShoppingList={shoppingLists}
            />
          ))
        : ""}
    </div>
  );
};

interface MonthContainerProps {
  relevantShoppingList: ShoppingListType[];
  monthString: string;
}

export const MonthContainer: FC<MonthContainerProps> = (props) => {
  const filtered = props.relevantShoppingList.filter(
    (s) =>
      new Date(s.createdDate).toLocaleDateString("en-us", {
        month: "long",
        year: "numeric",
      }) === props.monthString
  );
  return (
    <section>
      <p>{props.monthString}</p>
      {filtered.map((s) => (
        <ShoppingListCard shoppingListToDisplay={s} />
      ))}
    </section>
  );
};

interface ShoppingListCardProps {
  shoppingListToDisplay: ShoppingListType;
}

export const ShoppingListCard: FC<ShoppingListCardProps> = (props) => {
  const dispatch = useAppDispatch();
  function handleClick() {
    props.shoppingListToDisplay.id
      ? dispatch(setActiveList(props.shoppingListToDisplay.id))
      : alert("NOT IMPLEMENTED");
  }

  const statusStyleDictionary = {
    CANCELLED: styles.cancelled,
    OPEN: styles.open,
    COMPLETED: styles.completed,
  };

  return (
    <div className={styles.listItem} onClick={handleClick}>
      <div className={styles.listItemTitle}>
        {props.shoppingListToDisplay.name}
      </div>
      <div className={styles.date}>
        <i className="far fa-calendar-alt"></i>
        <span>
          {new Date(props.shoppingListToDisplay.createdDate).toLocaleDateString(
            "en-us",
            { day: "numeric", month: "long", year: "numeric" }
          )}
        </span>
      </div>
      <div
        className={statusStyleDictionary[props.shoppingListToDisplay.status]}
      >
        {props.shoppingListToDisplay.status}
      </div>
      <div className={styles.chevron}>
        <i className="fas fa-chevron-right"></i>
      </div>{" "}
    </div>
  );
};
