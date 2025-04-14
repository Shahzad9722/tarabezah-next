'use client';

import { useEffect, useState } from 'react';
import type { Step } from './types';
import StepSidebar from './step-sidebar';
import ClientSearchStep from './steps/step-2-client-search';
import DateStep from './steps/step-3-date';
import PartySizeStep from './steps/step-4-party-size';
import TimeStep from './steps/step-5-time';
import GeneralInfoStep from './steps/step-6-general-info';
import { Button } from '../ui/button';
import ConfirmationDialog from './steps/confirmation-dialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addGuestSchema, addReservationFormSchema } from '@/app/lib/validations';
import { Form } from '../ui/form';
import ClientSearch from './steps/client-search';
import { toast } from 'sonner';

const AddReservationIcon = () => (
  <svg width='29' height='29' viewBox='0 0 29 29' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M15.5 13.5H20.5V15.5H15.5V20.5H13.5V15.5H8.5V13.5H13.5V8.5H15.5V13.5ZM14.5 0.5C15.7917 0.5 17.0312 0.666667 18.2188 1C19.4062 1.33333 20.5208 1.80208 21.5625 2.40625C22.6042 3.01042 23.5469 3.73958 24.3906 4.59375C25.2344 5.44792 25.9635 6.39062 26.5781 7.42188C27.1927 8.45312 27.6667 9.56771 28 10.7656C28.3333 11.9635 28.5 13.2083 28.5 14.5C28.5 15.7917 28.3333 17.0312 28 18.2188C27.6667 19.4062 27.1979 20.5208 26.5938 21.5625C25.9896 22.6042 25.2604 23.5469 24.4062 24.3906C23.5521 25.2344 22.6094 25.9635 21.5781 26.5781C20.5469 27.1927 19.4323 27.6667 18.2344 28C17.0365 28.3333 15.7917 28.5 14.5 28.5C13.2083 28.5 11.9688 28.3333 10.7812 28C9.59375 27.6667 8.47917 27.1979 7.4375 26.5938C6.39583 25.9896 5.45312 25.2604 4.60938 24.4062C3.76562 23.5521 3.03646 22.6094 2.42188 21.5781C1.80729 20.5469 1.33333 19.4323 1 18.2344C0.666667 17.0365 0.5 15.7917 0.5 14.5C0.5 13.2083 0.666667 11.9688 1 10.7812C1.33333 9.59375 1.80208 8.47917 2.40625 7.4375C3.01042 6.39583 3.73958 5.45312 4.59375 4.60938C5.44792 3.76562 6.39062 3.03646 7.42188 2.42188C8.45312 1.80729 9.56771 1.33333 10.7656 1C11.9635 0.666667 13.2083 0.5 14.5 0.5ZM14.5 26.5C15.6042 26.5 16.6667 26.3594 17.6875 26.0781C18.7083 25.7969 19.6615 25.3906 20.5469 24.8594C21.4323 24.3281 22.2448 23.7031 22.9844 22.9844C23.724 22.2656 24.349 21.4583 24.8594 20.5625C25.3698 19.6667 25.7708 18.7083 26.0625 17.6875C26.3542 16.6667 26.5 15.6042 26.5 14.5C26.5 13.3958 26.3594 12.3333 26.0781 11.3125C25.7969 10.2917 25.3906 9.33854 24.8594 8.45312C24.3281 7.56771 23.7031 6.75521 22.9844 6.01562C22.2656 5.27604 21.4583 4.65104 20.5625 4.14062C19.6667 3.63021 18.7083 3.22917 17.6875 2.9375C16.6667 2.64583 15.6042 2.5 14.5 2.5C13.3958 2.5 12.3333 2.64062 11.3125 2.92188C10.2917 3.20312 9.33854 3.60938 8.45312 4.14062C7.56771 4.67188 6.75521 5.29688 6.01562 6.01562C5.27604 6.73438 4.65104 7.54167 4.14062 8.4375C3.63021 9.33333 3.22917 10.2917 2.9375 11.3125C2.64583 12.3333 2.5 13.3958 2.5 14.5C2.5 15.6042 2.64062 16.6667 2.92188 17.6875C3.20312 18.7083 3.60938 19.6615 4.14062 20.5469C4.67188 21.4323 5.29688 22.2448 6.01562 22.9844C6.73438 23.724 7.54167 24.349 8.4375 24.8594C9.33333 25.3698 10.2917 25.7708 11.3125 26.0625C12.3333 26.3542 13.3958 26.5 14.5 26.5Z'
      fill='white'
    />
  </svg>
);

const ClientSearchIcon = () => (
  <svg width='24' height='29' viewBox='0 0 24 29' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M23.1129 20.8527C21.9006 19.2257 20.1701 18.0602 18.2067 17.5483L18.1455 17.5351L16.7309 19.9228C16.73 20.2407 16.6032 20.5454 16.3784 20.7702C16.1536 20.995 15.849 21.1217 15.5311 21.1227C14.8711 21.1227 14.3312 20.5827 13.7013 18.9941V18.9557C13.7013 18.558 13.5433 18.1765 13.262 17.8952C12.9807 17.6139 12.5992 17.4559 12.2015 17.4559C11.8037 17.4559 11.4222 17.6139 11.1409 17.8952C10.8597 18.1765 10.7017 18.558 10.7017 18.9557V18.9953V18.9929C10.0297 20.5827 9.48501 21.1215 8.82629 21.1215C8.50836 21.1205 8.20373 20.9938 7.97892 20.769C7.75411 20.5442 7.62739 20.2395 7.62644 19.9216L6.25621 17.5291C4.27915 18.032 2.53278 19.1942 1.30563 20.8239L1.28883 20.8467C0.803676 21.6428 0.532922 22.551 0.50293 23.4828V23.4912C0.508929 23.6711 0.50293 23.8811 0.50293 24.0911V26.4908C0.50293 27.1272 0.755755 27.7376 1.20579 28.1876C1.65582 28.6377 2.26619 28.8905 2.90263 28.8905H21.5003C22.1367 28.8905 22.7471 28.6377 23.1971 28.1876C23.6472 27.7376 23.9 27.1272 23.9 26.4908V24.0911C23.9 23.8823 23.894 23.6711 23.9 23.4912C23.871 22.5483 23.5955 21.6295 23.1009 20.8263L23.1141 20.8503L23.1129 20.8527Z'
      fill='white'
    />
    <path
      d='M5.90106 6.44849C5.90106 9.95205 8.08478 15.0994 12.2003 15.0994C16.2438 15.0994 18.4995 9.95205 18.4995 6.44849V6.3705C18.4995 5.54328 18.3365 4.72415 18.02 3.9599C17.7034 3.19564 17.2394 2.50122 16.6545 1.91629C16.0695 1.33135 15.3751 0.867353 14.6109 0.550788C13.8466 0.234223 13.0275 0.0712891 12.2003 0.0712891C11.373 0.0712891 10.5539 0.234223 9.78966 0.550788C9.02541 0.867353 8.33099 1.33135 7.74605 1.91629C7.16112 2.50122 6.69712 3.19564 6.38055 3.9599C6.06399 4.72415 5.90106 5.54328 5.90106 6.3705V6.45209V6.44849Z'
      fill='white'
    />
  </svg>
);

const DateIcon = () => (
  <svg width='31' height='30' viewBox='0 0 31 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M2.1665 14.4997C2.1665 9.47167 2.1665 6.95701 3.72917 5.39567C5.29184 3.83434 7.80517 3.83301 12.8332 3.83301H18.1665C23.1945 3.83301 25.7092 3.83301 27.2705 5.39567C28.8318 6.95834 28.8332 9.47167 28.8332 14.4997V17.1663C28.8332 22.1943 28.8332 24.709 27.2705 26.2703C25.7078 27.8317 23.1945 27.833 18.1665 27.833H12.8332C7.80517 27.833 5.2905 27.833 3.72917 26.2703C2.16784 24.7077 2.1665 22.1943 2.1665 17.1663V14.4997Z'
      stroke='white'
      strokeWidth='2.5'
    />
    <path
      opacity='0.5'
      d='M8.83301 3.83301V1.83301M22.1663 3.83301V1.83301M2.83301 10.4997H28.1663'
      stroke='white'
      strokeWidth='2.5'
      strokeLinecap='round'
    />
    <path
      d='M23.5 21.1667C23.5 21.5203 23.3595 21.8594 23.1095 22.1095C22.8594 22.3595 22.5203 22.5 22.1667 22.5C21.813 22.5 21.4739 22.3595 21.2239 22.1095C20.9738 21.8594 20.8333 21.5203 20.8333 21.1667C20.8333 20.813 20.9738 20.4739 21.2239 20.2239C21.4739 19.9738 21.813 19.8333 22.1667 19.8333C22.5203 19.8333 22.8594 19.9738 23.1095 20.2239C23.3595 20.4739 23.5 20.813 23.5 21.1667ZM23.5 15.8333C23.5 16.187 23.3595 16.5261 23.1095 16.7761C22.8594 17.0262 22.5203 17.1667 22.1667 17.1667C21.813 17.1667 21.4739 17.0262 21.2239 16.7761C20.9738 16.5261 20.8333 16.187 20.8333 15.8333C20.8333 15.4797 20.9738 15.1406 21.2239 14.8905C21.4739 14.6405 21.813 14.5 22.1667 14.5C22.5203 14.5 22.8594 14.6405 23.1095 14.8905C23.3595 15.1406 23.5 15.4797 23.5 15.8333ZM16.8333 21.1667C16.8333 21.5203 16.6929 21.8594 16.4428 22.1095C16.1928 22.3595 15.8536 22.5 15.5 22.5C15.1464 22.5 14.8072 22.3595 14.5572 22.1095C14.3071 21.8594 14.1667 21.5203 14.1667 21.1667C14.1667 20.813 14.3071 20.4739 14.5572 20.2239C14.8072 19.9738 15.1464 19.8333 15.5 19.8333C15.8536 19.8333 16.1928 19.9738 16.4428 20.2239C16.6929 20.4739 16.8333 20.813 16.8333 21.1667ZM16.8333 15.8333C16.8333 16.187 16.6929 16.5261 16.4428 16.7761C16.1928 17.0262 15.8536 17.1667 15.5 17.1667C15.1464 17.1667 14.8072 17.0262 14.5572 16.7761C14.3071 16.5261 14.1667 16.187 14.1667 15.8333C14.1667 15.4797 14.3071 15.1406 14.5572 14.8905C14.8072 14.6405 15.1464 14.5 15.5 14.5C15.8536 14.5 16.1928 14.6405 16.4428 14.8905C16.6929 15.1406 16.8333 15.4797 16.8333 15.8333ZM10.1667 21.1667C10.1667 21.5203 10.0262 21.8594 9.77614 22.1095C9.52609 22.3595 9.18696 22.5 8.83333 22.5C8.47971 22.5 8.14057 22.3595 7.89052 22.1095C7.64048 21.8594 7.5 21.5203 7.5 21.1667C7.5 20.813 7.64048 20.4739 7.89052 20.2239C8.14057 19.9738 8.47971 19.8333 8.83333 19.8333C9.18696 19.8333 9.52609 19.9738 9.77614 20.2239C10.0262 20.4739 10.1667 20.813 10.1667 21.1667ZM10.1667 15.8333C10.1667 16.187 10.0262 16.5261 9.77614 16.7761C9.52609 17.0262 9.18696 17.1667 8.83333 17.1667C8.47971 17.1667 8.14057 17.0262 7.89052 16.7761C7.64048 16.5261 7.5 16.187 7.5 15.8333C7.5 15.4797 7.64048 15.1406 7.89052 14.8905C8.14057 14.6405 8.47971 14.5 8.83333 14.5C9.18696 14.5 9.52609 14.6405 9.77614 14.8905C10.0262 15.1406 10.1667 15.4797 10.1667 15.8333Z'
      fill='white'
    />
  </svg>
);

const PartySizeIcon = () => (
  <svg width='31' height='33' viewBox='0 0 31 33' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g clipPath='url(#clip0_454_6024)'>
      <path
        d='M15.5 14.5C14.1739 14.5 12.9021 13.9732 11.9645 13.0355C11.0268 12.0979 10.5 10.8261 10.5 9.5C10.5 8.17392 11.0268 6.90215 11.9645 5.96447C12.9021 5.02678 14.1739 4.5 15.5 4.5C16.8261 4.5 18.0979 5.02678 19.0355 5.96447C19.9732 6.90215 20.5 8.17392 20.5 9.5C20.5 10.8261 19.9732 12.0979 19.0355 13.0355C18.0979 13.9732 16.8261 14.5 15.5 14.5ZM15.5 6.5C13.84 6.5 12.5 7.84 12.5 9.5C12.5 11.16 13.84 12.5 15.5 12.5C17.16 12.5 18.5 11.16 18.5 9.5C18.5 7.84 17.16 6.5 15.5 6.5Z'
        fill='white'
      />
      <path
        d='M27.5 22.5C26.94 22.5 26.5 22.06 26.5 21.5C26.5 20.94 26.94 20.5 27.5 20.5C28.06 20.5 28.5 20.06 28.5 19.5C28.5 18.1739 27.9732 16.9021 27.0355 15.9645C26.0979 15.0268 24.8261 14.5 23.5 14.5H21.5C20.94 14.5 20.5 14.06 20.5 13.5C20.5 12.94 20.94 12.5 21.5 12.5C23.16 12.5 24.5 11.16 24.5 9.5C24.5 7.84 23.16 6.5 21.5 6.5C20.94 6.5 20.5 6.06 20.5 5.5C20.5 4.94 20.94 4.5 21.5 4.5C22.8261 4.5 24.0979 5.02678 25.0355 5.96447C25.9732 6.90215 26.5 8.17392 26.5 9.5C26.5 10.74 26.06 11.86 25.3 12.74C28.28 13.54 30.5 16.26 30.5 19.5C30.5 21.16 29.16 22.5 27.5 22.5ZM3.5 22.5C1.84 22.5 0.5 21.16 0.5 19.5C0.5 16.26 2.7 13.54 5.7 12.74C4.96 11.86 4.5 10.74 4.5 9.5C4.5 8.17392 5.02678 6.90215 5.96447 5.96447C6.90215 5.02678 8.17392 4.5 9.5 4.5C10.06 4.5 10.5 4.94 10.5 5.5C10.5 6.06 10.06 6.5 9.5 6.5C7.84 6.5 6.5 7.84 6.5 9.5C6.5 11.16 7.84 12.5 9.5 12.5C10.06 12.5 10.5 12.94 10.5 13.5C10.5 14.06 10.06 14.5 9.5 14.5H7.5C6.17392 14.5 4.90215 15.0268 3.96447 15.9645C3.02678 16.9021 2.5 18.1739 2.5 19.5C2.5 20.06 2.94 20.5 3.5 20.5C4.06 20.5 4.5 20.94 4.5 21.5C4.5 22.06 4.06 22.5 3.5 22.5ZM21.5 28.5H9.5C7.84 28.5 6.5 27.16 6.5 25.5V23.5C6.5 19.64 9.64 16.5 13.5 16.5H17.5C21.36 16.5 24.5 19.64 24.5 23.5V25.5C24.5 27.16 23.16 28.5 21.5 28.5ZM13.5 18.5C12.1739 18.5 10.9021 19.0268 9.96447 19.9645C9.02678 20.9021 8.5 22.1739 8.5 23.5V25.5C8.5 26.06 8.94 26.5 9.5 26.5H21.5C22.06 26.5 22.5 26.06 22.5 25.5V23.5C22.5 22.1739 21.9732 20.9021 21.0355 19.9645C20.0979 19.0268 18.8261 18.5 17.5 18.5H13.5Z'
        fill='white'
      />
    </g>
    <defs>
      <clipPath id='clip0_454_6024'>
        <rect width='30' height='32' fill='white' transform='translate(0.5 0.5)' />
      </clipPath>
    </defs>
  </svg>
);

const TimeIcon = () => (
  <svg width='29' height='29' viewBox='0 0 29 29' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M14.4998 27.8337C21.8636 27.8337 27.8332 21.8641 27.8332 14.5003C27.8332 7.13653 21.8636 1.16699 14.4998 1.16699C7.13604 1.16699 1.1665 7.13653 1.1665 14.5003C1.1665 21.8641 7.13604 27.8337 14.4998 27.8337Z'
      stroke='white'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M11.1665 11.167L15.8332 15.8337M19.8332 9.16699L13.1665 15.8337'
      stroke='white'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const GeneralInfoIcon = () => (
  <svg width='27' height='27' viewBox='0 0 27 27' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M12.1665 12.1404C12.1665 11.7867 12.307 11.4476 12.557 11.1975C12.8071 10.9475 13.1462 10.807 13.4998 10.807C13.8535 10.807 14.1926 10.9475 14.4426 11.1975C14.6927 11.4476 14.8332 11.7867 14.8332 12.1404V20.1404C14.8332 20.494 14.6927 20.8331 14.4426 21.0832C14.1926 21.3332 13.8535 21.4737 13.4998 21.4737C13.1462 21.4737 12.8071 21.3332 12.557 21.0832C12.307 20.8331 12.1665 20.494 12.1665 20.1404V12.1404ZM13.4998 5.56836C13.1462 5.56836 12.8071 5.70883 12.557 5.95888C12.307 6.20893 12.1665 6.54807 12.1665 6.90169C12.1665 7.25531 12.307 7.59445 12.557 7.8445C12.8071 8.09455 13.1462 8.23503 13.4998 8.23503C13.8535 8.23503 14.1926 8.09455 14.4426 7.8445C14.6927 7.59445 14.8332 7.25531 14.8332 6.90169C14.8332 6.54807 14.6927 6.20893 14.4426 5.95888C14.1926 5.70883 13.8535 5.56836 13.4998 5.56836Z'
      fill='white'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M13.4998 0.166992C6.13584 0.166992 0.166504 6.13633 0.166504 13.5003C0.166504 20.8643 6.13584 26.8337 13.4998 26.8337C20.8638 26.8337 26.8332 20.8643 26.8332 13.5003C26.8332 6.13633 20.8638 0.166992 13.4998 0.166992ZM2.83317 13.5003C2.83317 16.3293 3.95698 19.0424 5.95737 21.0428C7.95775 23.0432 10.6709 24.167 13.4998 24.167C16.3288 24.167 19.0419 23.0432 21.0423 21.0428C23.0427 19.0424 24.1665 16.3293 24.1665 13.5003C24.1665 10.6713 23.0427 7.95824 21.0423 5.95785C19.0419 3.95747 16.3288 2.83366 13.4998 2.83366C10.6709 2.83366 7.95775 3.95747 5.95737 5.95785C3.95698 7.95824 2.83317 10.6713 2.83317 13.5003Z'
      fill='white'
    />
  </svg>
);

const ConfirmationIcon = () => (
  <svg width='27' height='27' viewBox='0 0 27 27' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M1.5 13.5C1.5 6.87333 6.87333 1.5 13.5 1.5C20.1267 1.5 25.5 6.87333 25.5 13.5C25.5 20.1267 20.1267 25.5 13.5 25.5C6.87333 25.5 1.5 20.1267 1.5 13.5Z'
      stroke='white'
      strokeWidth='2.66667'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M8.1665 13.4997L12.1665 17.4997L18.8332 10.833'
      stroke='white'
      strokeWidth='2.66667'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const steps: Step[] = [
  {
    name: 'Add Reservation',
    icon: <AddReservationIcon />,
    hasPage: false,
    fields: [],
    step: 0,
  },
  {
    name: 'Client Search',
    icon: <ClientSearchIcon />,
    hasPage: true,
    fields: ['clientId'],
    step: 1,
  },
  {
    name: 'Date',
    icon: <DateIcon />,
    hasPage: true,
    fields: ['eventDate'],
    step: 2,
  },
  {
    name: 'Party Size',
    icon: <PartySizeIcon />,
    hasPage: true,
    fields: ['numberOfGuests'],
    step: 3,
  },
  {
    name: 'Time',
    icon: <TimeIcon />,
    hasPage: true,
    fields: ['eventTime', 'shiftId'],
    step: 4,
  },
  {
    name: 'General Info',
    icon: <GeneralInfoIcon />,
    hasPage: true,
    fields: ['tags', 'additionalNotes'],
    step: 5,
  },
  {
    name: 'Confirmation',
    icon: <ConfirmationIcon />,
    hasPage: false,
    fields: [],
    step: 0,
  },
];

const stepsWalkIn: Step[] = [
  {
    name: 'Add Walk-in',
    icon: <AddReservationIcon />,
    hasPage: false,
    fields: [],
    step: 0,
  },
  {
    name: 'Client Search',
    icon: <ClientSearchIcon />,
    hasPage: true,
    fields: ['clientId'],
    step: 1,
  },
  {
    name: 'Party Size',
    icon: <PartySizeIcon />,
    hasPage: true,
    fields: ['numberOfGuests'],
    step: 2,
  },
  {
    name: 'General Info',
    icon: <GeneralInfoIcon />,
    hasPage: true,
    fields: ['tags', 'additionalNotes'],
    step: 3,
  },
  {
    name: 'Confirmation',
    icon: <ConfirmationIcon />,
    hasPage: false,
    fields: [],
    step: 0,
  },
];

export default function AddReservation({ walkIn = false }: { walkIn?: boolean }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAddNewClient, setShowAddNewClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>({});

  const { isPending: fetchingEntities, data: entities = { sources: [], tags: [], shifts: [], tableTypes: [] } } =
    useQuery({
      queryKey: ['entities'],
      queryFn: async () => {
        const restaurantId = typeof window !== 'undefined' ? localStorage.getItem('selected-restaurant-id') : null;
        if (!restaurantId) {
          throw new Error('No restaurant selected');
        }
        const res = await fetch(`/api/reservation/form/entities?restaurantId=${restaurantId}`);
        if (!res.ok) throw new Error('Failed to fetch guest');
        const reservationFormEntities = await res.json();
        return reservationFormEntities.entities;
      },
    });

  const { mutateAsync: addGuest, isPending: addingGuest } = useMutation({
    mutationFn: (data) => {
      return fetch(`/api/reservation/guest`, {
        method: 'post',
        body: JSON.stringify(data),
      });
    },
  });

  const { mutateAsync: addReservation, isPending: submittingReservationForm } = useMutation({
    mutationFn: (data: any) => {
      return fetch(`/api/reservation/form`, {
        method: 'post',
        body: JSON.stringify(data),
      });
    },
  });

  const { mutateAsync: addWalkin, isPending: submittingWalkinForm } = useMutation({
    mutationFn: (data: any) => {
      return fetch(`/api/reservation/walk-in/form`, {
        method: 'post',
        body: JSON.stringify(data),
      });
    },
  });

  const guestForm = useForm({
    resolver: zodResolver(addGuestSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: undefined,
      birthday: undefined,
      sources: [],
      tags: [],
      clientNotes: '',
    },
  });

  const reservationForm = useForm({
    resolver: zodResolver(addReservationFormSchema),
    defaultValues: {
      clientId: '',
      eventDate: new Date(),
      eventTime: undefined,
      numberOfGuests: 2,
      shiftId: undefined,
      tags: [],
      additionalNotes: '',
    },
  });

  useEffect(() => {
    if (!fetchingEntities && !reservationForm.getValues('shiftId')) {
      reservationForm.setValue('shiftId', entities.shifts[0]?.guid);
    }
  }, [fetchingEntities]);

  const createGuest = async (payload: any) => {
    const toastId = toast.info('Adding guest');
    try {
      const response = await addGuest(payload);
      const { guest } = await response.json();

      setSelectedClient(guest);
      setShowAddNewClient(false);

      reservationForm.setValue('clientId', guest.guid);
      guestForm.reset();
      toast.success('Guest created successfully!');
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const checkForm = async (e: any) => {
    const toastId = toast.info('Submitting reservation');
    try {
      e.preventDefault();
      const isValid = await reservationForm.trigger(undefined, {
        shouldFocus: false,
      });
      if (!walkIn) {
        if (isValid) {
          const response = await addReservation(reservationForm.getValues());
          if (!response.ok) {
            throw new Error('Failed to create reservation');
          }
          formReset();
          toast.success('Reservation created successfully!');
        }
      } else {
        const errorFields = Object.keys(reservationForm?.formState?.errors);
        const requiredFields = ['clientId', 'numberOfGuests'];

        const isValid = errorFields.every((field) => !requiredFields.includes(field));
        if (isValid) {
          const response = await addWalkin(reservationForm.getValues());
          if (!response.ok) {
            throw new Error('Failed to create reservation');
          }
          formReset();
          toast.success('Reservation created successfully!');
        }
      }
    } catch (error) {
      console.log('error submitting form', error);
      toast.error('Failed to create reservation');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const formReset = () => {
    reservationForm.reset();
    reservationForm.setValue('shiftId', entities.shifts[0]?.guid);

    guestForm.reset();

    setShowConfirmDialog(false);
    setSelectedClient({});
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (walkIn) {
      if (currentStep < stepsWalkIn.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (Object.keys(reservationForm?.formState?.errors).length) {
      const step = (walkIn ? stepsWalkIn : steps)
        .filter((s) => s.hasPage && s.fields?.length)
        .find((s) => s.fields.includes(Object.keys(reservationForm?.formState?.errors)[0]));
      if (step) {
        setCurrentStep(step.step);
        setShowConfirmDialog(false);
      }
    }
  }, [reservationForm?.formState?.errors]);

  return (
    <div className='md:h-screen flex flex-col md:flex-row bg-color-121020 bg-[linear-gradient(119.26deg,_rgba(18,_17,_32,_0.23)_45.47%,_rgba(185,_136,_88,_0.23)_105.35%)] shadow-lg w-full min-h-screen'>
      <StepSidebar
        steps={walkIn ? stepsWalkIn : steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        confirmation={showConfirmDialog}
      />

      <div className='w-full flex-1 p-6 overflow-x-auto'>
        <div className='w-full flex justify-end mb-8'>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M1.01074 14.9911L8.00141 8.00043L14.9921 14.9911M14.9921 1.00977L8.00008 8.00043L1.01074 1.00977'
              stroke='#F5F5F5'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>

        {currentStep === 1 && (
          <>
            {walkIn && (
              <Button
                onClick={() => {
                  setCurrentStep(2);
                  reservationForm.setValue('clientId', '0');
                }}
                className='mb-6'
              >
                Skip Client Information
              </Button>
            )}
          </>
        )}

        {currentStep === 1 && !showAddNewClient && (
          <>
            <ClientSearch
              reservationForm={reservationForm}
              guestForm={guestForm}
              setShowAddNewClient={setShowAddNewClient}
              selected={selectedClient}
              setSelected={setSelectedClient}
            />
            {!selectedClient.id && (
              <p className='text-red-500 mb-6'>{reservationForm?.formState?.errors?.clientId?.message}</p>
            )}
          </>
        )}

        {showAddNewClient && (
          <Form {...guestForm}>
            <form onSubmit={guestForm.handleSubmit(createGuest)} className='space-y-4'>
              {!fetchingEntities && currentStep === 1 && (
                <ClientSearchStep
                  form={guestForm}
                  sources={entities.sources}
                  tags={entities.tags}
                  submittingForm={addingGuest}
                  setShowAddNewClient={setShowAddNewClient}
                  walkIn={walkIn}
                />
              )}
            </form>
          </Form>
        )}
        <Form {...reservationForm}>
          <form onSubmit={checkForm} className='space-y-4'>
            {currentStep === 2 &&
              (walkIn ? <PartySizeStep form={reservationForm} /> : <DateStep form={reservationForm} />)}
            {currentStep === 3 &&
              (walkIn ? (
                <GeneralInfoStep form={reservationForm} tags={entities.tags} />
              ) : (
                <PartySizeStep form={reservationForm} />
              ))}

            {!fetchingEntities &&
              currentStep === 4 &&
              (walkIn ? (
                <GeneralInfoStep form={reservationForm} tags={entities.tags} />
              ) : (
                <TimeStep form={reservationForm} shifts={entities.shifts} tableTypes={entities.tableTypes} />
              ))}
            {currentStep === 5 && <GeneralInfoStep form={reservationForm} tags={entities.tags} />}

            <div className='flex justify-between gap-4'>
              <Button
                type='button'
                variant='secondary'
                onClick={prevStep}
                disabled={currentStep === 1}
                className='w-full'
              >
                Back
              </Button>
              <Button
                type='button'
                onClick={nextStep}
                disabled={currentStep === 5 || (currentStep === 3 && walkIn)}
                className='w-full'
              >
                Next
              </Button>
            </div>

            {(currentStep === 5 || (currentStep === 3 && walkIn)) && (
              <Button type='button' onClick={() => setShowConfirmDialog(true)} className='w-full mt-4'>
                Confirm
              </Button>
            )}
          </form>
        </Form>
      </div>

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onSubmit={checkForm}
        submittingForm={submittingReservationForm}
      />
    </div>
  );
}
