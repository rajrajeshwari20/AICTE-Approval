import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Region, ApplicationType, InstitutionCategory } from '../../types';
import { X, Building, CheckCircle2 } from 'lucide-react';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({ isOpen, onClose }) => {
  const { addNewApplication } = useApp();

  const [institutionName, setInstitutionName] = useState('');
  const [region, setRegion] = useState<Region>('Western (Mumbai)');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Pune');
  const [type, setType] = useState<ApplicationType>('New Technical Institution');
  const [category, setCategory] = useState<InstitutionCategory>('Engineering & Technology');
  const [landAreaAcres, setLandAreaAcres] = useState(5.5);
  const [builtUpAreaSqM, setBuiltUpAreaSqM] = useState(15000);
  const [proposedIntake, setProposedIntake] = useState(360);
  const [facultyCount, setFacultyCount] = useState(25);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName.trim()) return;

    addNewApplication({
      institutionName,
      region,
      state,
      city,
      type,
      category,
      landAreaAcres,
      builtUpAreaSqM,
      proposedIntake,
      facultyCount
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Submit New AICTE Approval Application
            </h2>
            <p className="text-xs text-slate-500">
              Approval Process Handbook (APH) AY 2026-27 Automated Intake
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Legal Name</label>
            <input
              type="text"
              placeholder="e.g. Pune Apex Institute of Technology & AI"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Regional Jurisdiction</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Western (Mumbai)">Western (Mumbai)</option>
                <option value="Northern (Kanpur)">Northern (Kanpur)</option>
                <option value="Southern (Chennai)">Southern (Chennai)</option>
                <option value="South-Western (Bengaluru)">South-Western (Bengaluru)</option>
                <option value="Eastern (Kolkata)">Eastern (Kolkata)</option>
                <option value="Central (Bhopal)">Central (Bhopal)</option>
                <option value="North-West (Chandigarh)">North-West (Chandigarh)</option>
                <option value="South-Central (Hyderabad)">South-Central (Hyderabad)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / District</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Approval Application Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ApplicationType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="New Technical Institution">New Technical Institution</option>
                <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
                <option value="Increase in Intake / New Program">Increase in Intake</option>
                <option value="Change of Site / Location">Change of Site</option>
                <option value="Conversion to Degree">Conversion to Degree</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Discipline</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InstitutionCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Engineering & Technology">Engineering & Technology</option>
                <option value="Management (MBA/PGDM)">Management (MBA/PGDM)</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Architecture & Planning">Architecture & Planning</option>
                <option value="Computer Applications (MCA)">Computer Applications (MCA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500">Land (Acres)</span>
              <input
                type="number"
                step="0.1"
                value={landAreaAcres}
                onChange={(e) => setLandAreaAcres(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-bold mt-1"
                required
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Built-Up (m²)</span>
              <input
                type="number"
                value={builtUpAreaSqM}
                onChange={(e) => setBuiltUpAreaSqM(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-bold mt-1"
                required
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Intake</span>
              <input
                type="number"
                value={proposedIntake}
                onChange={(e) => setProposedIntake(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-bold mt-1"
                required
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Faculty</span>
              <input
                type="number"
                value={facultyCount}
                onChange={(e) => setFacultyCount(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-bold mt-1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs transition"
            >
              Submit & Enqueue for Scrutiny
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
