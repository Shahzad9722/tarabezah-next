'use client';
import { useState, useRef } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Button } from '../components/ui/button';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [tableType, setTableType] = useState('');
  const [name, setName] = useState('');
  const [isInteractable, setIsInteractable] = useState(false);
  const [errors, setErrors] = useState({
    file: '',
    name: '',
    tableType: '',
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data');

  const validateForm = () => {
    const newErrors = {
      file: '',
      name: '',
      tableType: '',
    };
    let isValid = true;

    // File validation
    if (!file) {
      newErrors.file = 'Please upload an image file';
      isValid = false;
    } else if (
      !(
        file.name.endsWith('.svg') ||
        file.name.endsWith('.png') ||
        file.name.endsWith('.jpg') ||
        file.name.endsWith('.jpeg')
      )
    ) {
      newErrors.file = 'Only SVG, PNG, JPG, and JPEG files are allowed';
      isValid = false;
    }

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
      isValid = false;
    }

    // Table type validation
    if (isInteractable && !tableType) {
      newErrors.tableType = 'Please select a table type';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('file', file as File);
      formData.append('purpose', isInteractable ? 'Reservable' : 'Decorative');
      formData.append('tableType', !isInteractable ? 'Custom' : tableType);

      const response = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast.success('Image uploaded successfully!');

      // Reset form
      setFile(null);
      setName('');
      setTableType('');
      setIsInteractable(false);

      setErrors({
        file: '',
        name: '',
        tableType: '',
      });
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center'
      style={{
        background: 'linear-gradient(119deg, rgba(18, 17, 32, 0.95) 45.47%, rgba(185, 136, 88, 0.90) 105.35%)',
        backgroundSize: 'cover',
      }}
    >
      <Toaster position='bottom-right' reverseOrder={false} />
      <div className='w-[400px] p-8 rounded-2xl backdrop-blur-sm bg-[#121120]/80 shadow-xl border border-[#2d2a45]/30'>
        <h2 className='text-2xl font-bold text-white text-center mb-8'>Upload Icon</h2>

        <form onSubmit={handleUpload} className='space-y-6'>
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${errors.file ? 'border-red-500' : 'border-[#2d2a45] hover:border-[#b98858]'
              }`}
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.add('border-[#b98858]');
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.add('border-[#b98858]');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.remove('border-[#b98858]');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.remove('border-[#b98858]');
              const droppedFile = e.dataTransfer.files[0];
              if (
                droppedFile &&
                (droppedFile.name.endsWith('.svg') ||
                  droppedFile.name.endsWith('.png') ||
                  droppedFile.name.endsWith('.jpg') ||
                  droppedFile.name.endsWith('.jpeg'))
              ) {
                setFile(droppedFile);
                setErrors({ ...errors, file: '' });
              } else {
                setErrors({ ...errors, file: 'Only SVG, PNG, JPG, and JPEG files are allowed' });
              }
            }}
          >
            <div className='flex flex-col items-center gap-4'>
              <div className='p-4 rounded-full bg-[#2d2a45]/50'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='text-[#b98858]'
                >
                  <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                  <polyline points='17 8 12 3 7 8' />
                  <line x1='12' y1='3' x2='12' y2='15' />
                </svg>
              </div>
              <div className='text-center'>
                {file ? (
                  <div className='bg-[#2d2a45] p-2 rounded-md mb-2'>
                    <p className='text-sm text-white flex items-center justify-center gap-2'>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-[#b98858]'
                      >
                        <path d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z' />
                        <polyline points='13 2 13 9 20 9' />
                      </svg>
                      {file.name}
                    </p>
                  </div>
                ) : (
                  <p className='text-sm text-white mb-1'>Drag & drop your SVG, PNG, JPG, or JPEG file here, or</p>
                )}
                <label className='cursor-pointer text-[#b98858] hover:text-[#a77748] transition-colors'>
                  browse
                  <input
                    ref={inputRef}
                    type='file'
                    accept='.svg,.png,.jpg,.jpeg'
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] || null;
                      setFile(selectedFile);
                      if (
                        selectedFile &&
                        !(
                          selectedFile.name.endsWith('.svg') ||
                          selectedFile.name.endsWith('.png') ||
                          selectedFile.name.endsWith('.jpg') ||
                          selectedFile.name.endsWith('.jpeg')
                        )
                      ) {
                        setErrors({
                          ...errors,
                          file: 'Only SVG, PNG, JPG, and JPEG files are allowed',
                        });
                      } else {
                        setErrors({ ...errors, file: '' });
                      }
                    }}
                    className='hidden'
                  />
                </label>
              </div>
              {errors.file && <p className='text-red-500 text-sm'>{errors.file}</p>}
              {file && !errors.file && (
                <div className='flex items-center gap-2 text-sm text-white'>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-green-500'
                  >
                    <path d='M20 6L9 17l-5-5' />
                  </svg>
                  File selected
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor='name' className='text-white mb-2 block'>
              Name
            </Label>
            <Input
              id='name'
              placeholder='Enter the element name'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({ ...errors, name: '' });
                }
              }}
              className='w-full'
            />
            {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              checked={isInteractable}
              onCheckedChange={(checked) => setIsInteractable(checked as boolean)}
              id='interactable'
            />
            <Label htmlFor='interactable' className='text-white'>
              Interactable
            </Label>
          </div>

          <div>
            <Label htmlFor='tableType' className='text-white mb-2 block'>
              Table Type
            </Label>
            <div className='relative'>
              <select
                id='tableType'
                disabled={!isInteractable}
                value={tableType}
                onChange={(e) => {
                  setTableType(e.target.value);
                  if (e.target.value) {
                    setErrors({ ...errors, tableType: '' });
                  }
                }}
                className={`w-full py-3 px-4 rounded-lg bg-[#2d2a45]/50 text-white appearance-none ${errors.tableType ? 'border-red-500' : 'border-[#2d2a45]'
                  } focus:border-[#b98858] transition-colors focus:outline-none`}
              >
                <option value=''>-- Select table type --</option>
                <option value='Square'>SquareTable</option>
                <option value='Round'>RoundTable</option>
                <option value='Rectangle'>RectangleTable</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
                <ChevronDown className='h-4 w-4' />
              </div>
            </div>
            {errors.tableType && <p className='text-red-500 text-sm mt-1'>{errors.tableType}</p>}
          </div>

          <Button type='submit' className='w-full'>
            {loading ? (
              <>
                <Loader2 className='animate-spin mr-2' size={18} /> Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
