import {useEffect} from "react"

export default function useDeleteSelected({
    rootSelector = ".institution-dash",
    checkboxSelector = ".row-select",
    buttonSelector = "#delete-btn",


} = {}){
    useEffect(() => {
        const root = document.querySelector(rootSelector);
        const btn = document.querySelector(buttonSelector);
        if(!root || !btn) return;

        const updateButtonState = () => {
            const anyChecked = ! !root.querySelector(`${checkboxSelector}:checked`);
            btn.disabled = !anyChecked;
        };

        const onChange = (e) => {
            if(!e.target.matches(checkboxSelector)) return;
            updateButtonState();
        };

        const onClick = (e) => {
            if(e.target != btn || btn.disabled) return;
            root.querySelectorAll(`${checkboxSelector}:checked`).forEach(cb => {
                const row = cb.closest("tr");
                if(row?.parentElement) row.parentElement.removeChild(row);
            })
            updateButtonState();
        };

        updateButtonState();
        root.addEventListener("change", onChange);
        document.addEventListener("click", onClick);

        return () => {
            root.removeEventListener("change", onChange);
            document.removeEventListener("click", onClick);
        };
    },[rootSelector, checkboxSelector, buttonSelector]);
}