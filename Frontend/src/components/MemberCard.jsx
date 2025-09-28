// src/components/MemberCard.jsx
import React from "react";
import { Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MemberCard = ({ member, onDelete }) => {
  const navigate = useNavigate();

  // Avatar Emoji (based on username first char)
  const emojiList = ["👨‍💻", "👩‍💻", "🧑‍🚀", "🧑‍🎨", "👮‍♂️", "🧑‍🔧", "🧑‍🏫", "🧑‍⚕️"];
  const emoji =
    member.username && member.username.length > 0
      ? emojiList[member.username.charCodeAt(0) % emojiList.length]
      : "👤";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
      {/* Avatar Emoji */}
      <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-4xl bg-gray-100">
        {emoji}
      </div>

      {/* Name & Username */}
      <h4 className="text-lg font-semibold">{member.fullname}</h4>
      <p className="text-gray-500 text-sm">@{member.username}</p>

      {/* Permissions */}
      <p className="text-gray-400 text-xs mt-1 text-center">
        {Array.isArray(member.permissions) ? member.permissions.join(", ") : ""}
      </p>

      {/* Actions */}
      <div className="flex gap-4 mt-4">
        {/* Edit Button */}
        <button
          onClick={() => navigate(`/members/${member._id}/permissions`)}
          title="Modify Permissions" // hover tooltip
          className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200"
        >
          <Edit size={20} />
        </button>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={() => onDelete(member._id)}
            title="Remove Member" // hover tooltip
            className="p-2 bg-red-100 rounded-lg hover:bg-red-200"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
