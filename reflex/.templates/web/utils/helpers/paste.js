export default function usePasteHandler(target_ids, event_actions, on_paste) {
  return useEffect(() => {
    const handle_paste = (_ev) => {
      const clipboardData = _ev.clipboardData;
      const hasFile = Array.from(clipboardData.items).some(
        (item) => item.kind === 'file'
      );
      const hasText = Array.from(clipboardData.items).some(
        (item) => item.kind === 'string'
      );

      // If there is a file, prevent default behavior to stop pasting the file path
      if (hasFile) {
        _ev.preventDefault();
        handle_paste_data(clipboardData).then(on_paste);
      } else if (hasText && event_actions.preventDefault) {
        // Allow normal text pasting unless preventDefault is enabled
        _ev.preventDefault();
        handle_paste_data(clipboardData).then(on_paste);
      }
      
      if (event_actions.stopPropagation) {
        _ev.stopPropagation();
      }
    };

    const targets = target_ids
      .map((id) => document.getElementById(id))
      .filter((element) => !!element);

    if (target_ids.length === 0) {
      targets.push(document);
    }

    targets.forEach((target) =>
      target.addEventListener("paste", handle_paste, false)
    );

    return () => {
      targets.forEach((target) =>
        target.removeEventListener("paste", handle_paste, false)
      );
    };
  });
}
