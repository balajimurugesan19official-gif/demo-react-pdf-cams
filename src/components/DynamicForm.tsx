import { useDispatch, useSelector } from 'react-redux';
import { setFocusedField } from '../store/focusSlice';
import { motion } from 'framer-motion';
import type { RootState } from '../store/store';
import { useState, useEffect } from 'react';

export default function DynamicForm() {
  const dispatch = useDispatch();
  const fields = useSelector((s: RootState) => s.form.fields) as any[];

  const [isReadOnly, setIsReadOnly] = useState(true);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  // Initialize local editable state when fields load
  useEffect(() => {
    if (fields?.length) {
      const initialValues = Object.fromEntries(
        fields.map((f) => [f.id, f.value])
      );
      setFormValues(initialValues);
    }
  }, [fields]);

  const handleChange = (id: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  if (!fields || fields.length === 0)
    return <div className="p-4 text-gray-500">No fields detected yet</div>;

  return (
    <div className="p-4 space-y-3">
      {/* 🧠 Top Bar with Toggle */}
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <h2 className="text-lg font-semibold text-gray-700">
          Extracted Form Data
        </h2>
        <button
          type="button"
          onClick={() => setIsReadOnly(!isReadOnly)}
          className={`text-sm px-3 py-1 rounded border ${
            isReadOnly
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isReadOnly ? 'Enable Edit ✏️' : 'View Mode 🔒'}
        </button>
      </div>

      {/* 🧾 Form Fields */}
      <form className="space-y-3">
        {fields.map((field) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-1"
          >
            <label className="text-sm font-medium text-gray-700">
              {field.label}
            </label>

            {/* TEXT FIELD */}
            {field.type === 'text' && (
              <input
                type="text"
                value={formValues[field.id] ?? ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                readOnly={isReadOnly}
                onFocus={() => dispatch(setFocusedField(field.id))}
                onBlur={() => dispatch(setFocusedField(null))}
                className={`px-2 py-1 border rounded ${
                  isReadOnly
                    ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                    : 'bg-white focus:ring-2 focus:ring-blue-400'
                }`}
              />
            )}

            {/* NUMBER FIELD */}
            {field.type === 'number' && (
              <input
                type="number"
                value={formValues[field.id] ?? ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                readOnly={isReadOnly}
                onFocus={() => dispatch(setFocusedField(field.id))}
                onBlur={() => dispatch(setFocusedField(null))}
                className={`px-2 py-1 border rounded ${
                  isReadOnly
                    ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                    : 'bg-white focus:ring-2 focus:ring-blue-400'
                }`}
              />
            )}

            {/* DATE FIELD */}
            {field.type === 'date' && (
              <input
                type="date"
                value={
                  formValues[field.id]
                    ? new Date(formValues[field.id]).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) => handleChange(field.id, e.target.value)}
                readOnly={isReadOnly}
                onFocus={() => dispatch(setFocusedField(field.id))}
                onBlur={() => dispatch(setFocusedField(null))}
                className={`px-2 py-1 border rounded ${
                  isReadOnly
                    ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                    : 'bg-white focus:ring-2 focus:ring-blue-400'
                }`}
              />
            )}

            {/* SINGLE CHECKBOX */}
            {field.type === 'checkbox' && (
              <input
                type="checkbox"
                checked={!!formValues[field.id]}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                disabled={isReadOnly}
                onFocus={() => dispatch(setFocusedField(field.id))}
                onBlur={() => dispatch(setFocusedField(null))}
                className="w-4 h-4 accent-blue-500 cursor-pointer disabled:opacity-60"
              />
            )}

            {/* MULTI-CHECKBOX GROUP */}
            {field.type === 'checkbox-group' && (
              <div className="space-y-1">
                {field.options?.map((opt: any, idx: number) => (
                  <label key={idx} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!!opt.value}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        const updatedOptions = field.options.map(
                          (o: any, i: number) =>
                            i === idx ? { ...o, value: e.target.checked } : o
                        );
                        handleChange(field.id, updatedOptions);
                      }}
                      className="w-4 h-4 accent-blue-500 cursor-pointer disabled:opacity-60"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </form>
    </div>
  );
}
