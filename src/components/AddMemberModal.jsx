import { useState, useEffect } from 'react';

export default function AddMemberModal({ isOpen, onClose, onAddMember }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Member',
    leadPosition: '',
    image: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', role: 'Member', leadPosition: '', image: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onAddMember({
      name: formData.name.trim(),
      role: formData.role,
      leadPosition: formData.role === 'Lead' ? formData.leadPosition.trim() : null,
      image: formData.image.trim(),
    });
    
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center font-body-md text-body-md bg-surface/90 backdrop-blur-3xl p-margin-mobile"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div className="absolute inset-0 bg-caustic pointer-events-none opacity-30"></div>
      
      <div className="w-full max-w-lg bg-surface-container-highest/60 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] relative z-10 overflow-hidden flex flex-col transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary-fixed">person_add</span>
            <span className="font-display-lg text-[20px] text-white tracking-tight">New Member Registration</span>
          </div>
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest">
              Full Name <span className="text-secondary-fixed">*</span>
            </label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Dr. Aris Thorne"
              required
              className="w-full bg-surface-dim/50 border border-white/10 focus:border-secondary-fixed text-white font-body-md px-4 py-3 rounded-xl outline-none transition-all focus:bg-surface-dim/80"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="role" className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest">
                Role
              </label>
              <select 
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-surface-dim/50 border border-white/10 focus:border-secondary-fixed text-white font-body-md px-4 py-3 rounded-xl outline-none transition-all focus:bg-surface-dim/80 appearance-none"
              >
                <option value="Member">Maker / Member</option>
                <option value="Lead">Lead</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>

            {formData.role === 'Lead' && (
              <div className="flex flex-col gap-2 flex-1" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <label htmlFor="leadPosition" className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest">
                  Lead Position
                </label>
                <input 
                  type="text" 
                  id="leadPosition"
                  name="leadPosition"
                  value={formData.leadPosition}
                  onChange={handleChange}
                  placeholder="e.g. AI Lead"
                  className="w-full bg-surface-dim/50 border border-white/10 focus:border-secondary-fixed text-white font-body-md px-4 py-3 rounded-xl outline-none transition-all focus:bg-surface-dim/80"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="image" className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest">
              Profile Image URL (Optional)
            </label>
            <input 
              type="url" 
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full bg-surface-dim/50 border border-white/10 focus:border-secondary-fixed text-white font-body-md px-4 py-3 rounded-xl outline-none transition-all focus:bg-surface-dim/80"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 mt-4 pt-6 border-t border-white/5">
            <button 
              type="button"
              className="px-6 py-3 rounded-xl bg-transparent border border-white/10 text-on-surface hover:bg-white/5 transition-all font-label-mono text-label-mono tracking-widest"
              onClick={onClose}
            >
              CANCEL
            </button>
            <button 
              type="submit"
              disabled={!formData.name.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary-fixed to-[#0066ff] text-white hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-label-mono text-label-mono tracking-widest flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              REGISTER MEMBER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
