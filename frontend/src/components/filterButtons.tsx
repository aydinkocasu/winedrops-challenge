import { useState } from "react";
import { SortBy } from "../api/api";

const FilterButtons = ({ change }: any) => {

  const [selectedButtonId, setSelectedButtonId] = useState(0)

  const changeActiveColor = (id: number) => selectedButtonId === id ? 'active' : ''

  const changeActive = (id: number) => {
    setSelectedButtonId(id)
    switch (id) {
      case 0:
        change(SortBy.REVENUE);
        break;  // Add break
      case 1:
        change(SortBy.ORDERS);
        break;  // Add break
      case 2:
        change(SortBy.BOTTLES_SOLD);
        break;  // Add break
    }
  }
  return (
    <div className="d-flex">
      <button className={changeActiveColor(0)} onClick={() => { changeActive(0) }}>By revenue</button>
      <button className={changeActiveColor(1)} onClick={() => { changeActive(1) }}>By # bottles sold</button>
      <button className={changeActiveColor(2)} onClick={() => { changeActive(2) }}>By # orders</button>
    </div>
  )
}

export default FilterButtons;
