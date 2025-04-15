import { User } from "lucide-react";

export default function TeamMemberCard({ member }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-t-4 border-t-[#0CB8B6]">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 mb-4 bg-[#0CB8B6]/10 rounded-full flex items-center justify-center">
          {member.icon || <User className="text-[#0CB8B6]" size={32} />}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
        <div className="w-12 h-1 bg-[#0CB8B6] my-2"></div>
        <p className="font-medium text-[#CE592C] mb-3">{member.role}</p>
        
        <p className="text-gray-600 text-center">{member.bio}</p>
        
      </div>
    </div>
  );
}