import React from "react";
import { EmojiPicker } from "@ferrucc-io/emoji-picker";

export default function EmojiePicker({ handleEmojiSelect }) {
  return (
    <EmojiPicker
      onEmojiSelect={handleEmojiSelect}
      className="border border-zinc-200 dark:border-zinc-800 rounded-lg"
      emojisPerRow={12}
      emojiSize={28}
    >
      <EmojiPicker.Header className="p-2 pb-0">
        <EmojiPicker.Input
          placeholder="Search emoji"
          autoFocus={true}
          className="focus:ring-2 focus:ring-inset ring-1 ring-transparent"
        />
      </EmojiPicker.Header>
      <EmojiPicker.Group>
        <EmojiPicker.List hideStickyHeader={true} containerHeight={200} />
      </EmojiPicker.Group>
    </EmojiPicker>
  );
}
