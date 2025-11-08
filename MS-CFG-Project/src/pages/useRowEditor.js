// src/useRowEditor.js
import { useEffect } from "react";

// helpers
const clampNumber = (val, { min = 0, max = 1000, decimals = 2 } = {}) => {
  if (val === "" || val === null || val === undefined) return null;
  const n = Number(val);
  if (Number.isNaN(n)) return null;
  const clamped = Math.min(Math.max(n, min), max);
  return Number(clamped.toFixed(decimals));
};

export default function useRowEditor({
  editBtnSelector = ".edit-btn",
  // columns: [Exam, Min, Credits, Date, Delete, Edit]
  minColIndex = 1,
  creditsColIndex = 2,
} = {}) {
  useEffect(() => {
    let activeRow = null; // only one being edited at a time

    const onClick = (e) => {
      const btn = e.target.closest(editBtnSelector);
      if (!btn) return;

      const tr = btn.closest("tr");
      if (!tr) return;

      // If another row is active, ignore (or you can auto-cancel that one)
      if (activeRow && activeRow !== tr) return;

      const tds = tr.querySelectorAll("td");
      const minTd = tds[minColIndex];
      const credTd = tds[creditsColIndex];
      if (!minTd || !credTd) return;

      // Already editing? -> Save
      if (tr.dataset.editing === "true") {
        const minInput = minTd.querySelector("input[type='number']");
        const credInput = credTd.querySelector("input[type='number']");
        if (!minInput || !credInput) return;

        const minNew = clampNumber(minInput.value, { min: 0, max: 100, decimals: 0 });   // scores are usually ints 0-100
        const credNew = clampNumber(credInput.value, { min: 0, max: 30, decimals: 1 });  // credits up to, say, 30.0

        // Write back if valid; otherwise restore original
        minTd.textContent = (minNew ?? minTd.dataset.origText);
        credTd.textContent = (credNew ?? credTd.dataset.origText);

        btn.textContent = "Edit";
        tr.dataset.editing = "false";
        activeRow = null;
        return;
      }

      // ENTER EDIT MODE
      const minOrig = minTd.textContent.trim();
      const credOrig = credTd.textContent.trim();
      minTd.dataset.origText = minOrig;
      credTd.dataset.origText = credOrig;

      // Build inputs
      const minInput = document.createElement("input");
      minInput.type = "number";
      minInput.value = minOrig;
      minInput.min = "0";
      minInput.max = "100";
      minInput.step = "1";
      minInput.style.width = "6rem";
      minInput.style.marginRight = "8px";

      const credInput = document.createElement("input");
      credInput.type = "number";
      credInput.value = credOrig;
      credInput.min = "0";
      credInput.max = "30";
      credInput.step = "0.5";
      credInput.style.width = "6rem";
      credInput.style.marginRight = "8px";

      const save = document.createElement("button");
      save.type = "button";
      save.textContent = "Save";
      save.className = "num-save-btn";
      save.style.marginRight = "6px";

      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = "Cancel";
      cancel.className = "num-cancel-btn";

      // Clear cells & insert controls
      minTd.textContent = "";
      credTd.textContent = "";
      minTd.append(minInput);
      credTd.append(credInput, save, cancel);

      btn.textContent = "Save";
      tr.dataset.editing = "true";
      activeRow = tr;

      // Inline Save button (also mirrors main Edit->Save)
      save.addEventListener("click", () => {
        const minNew = clampNumber(minInput.value, { min: 0, max: 100, decimals: 0 });
        const credNew = clampNumber(credInput.value, { min: 0, max: 30, decimals: 1 });

        minTd.textContent = (minNew ?? minOrig);
        credTd.textContent = (credNew ?? credOrig);

        btn.textContent = "Edit";
        tr.dataset.editing = "false";
        activeRow = null;
      });

      // Cancel handler
      cancel.addEventListener("click", () => {
        minTd.textContent = minOrig;
        credTd.textContent = credOrig;
        btn.textContent = "Edit";
        tr.dataset.editing = "false";
        activeRow = null;
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [editBtnSelector, minColIndex, creditsColIndex]);
}