'use client';

import { Modal, ModalBody, ModalHeader } from 'reactstrap'; // Adjust this path as per your setup
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';// Adjust this import if needed
import { useDispatch } from 'react-redux'; // Adjust this import path
import { getUserInfoFromToken } from '@/constants';
import { upgradeDonor } from '@/Slice/bloodDonation';

const schema = yup.object({
  bloodType: yup.string().required('Blood Type is required'),
  medicalHistory: yup.string().trim(),
}).required();

const RoleUpgradeModal = ({ isOpen, toggleModal }) => {
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { userId } = getUserInfoFromToken(); // make sure this only runs on client
  const id = userId;

  const onSubmit = (data) => {
    const requestData = {
      user_id: id,
      bloodType: data?.bloodType,
      medicalHistory: data?.medicalHistory,
    };
    dispatch(upgradeDonor(requestData));
    toggleModal(); // close after submission
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Become Blood Donor</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px' }}>
          {/* Blood Group Select */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Blood Group <span style={{ color: '#F15B43' }}>*</span>
            </label>
            <Controller
              name="bloodType"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ReactSelect
                  options={BloodGroupOptions}
                  value={BloodGroupOptions.find((opt) => opt.value === value)}
                  onChange={(selected) => onChange(selected?.value)}
                  isClearable
                  isSearchable
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      border: errors?.bloodType ? '1px solid red' : '1px solid #B8BDC9',
                      minHeight: 45,
                      height: 45,
                      boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                      '&:hover': {
                        border: errors?.bloodType ? '1px solid red' : '1px solid #B8BDC9',
                      },
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      height: 45,
                      alignItems: 'center',
                      padding: '0 15px',
                    }),
                    indicatorsContainer: (provided) => ({
                      ...provided,
                      height: 45,
                      alignItems: 'center',
                    }),
                  }}
                />
              )}
              defaultValue=""
            />
            {errors?.bloodType && (
              <div style={{ color: 'red', marginTop: '5px' }}>
                {errors?.bloodType?.message}
              </div>
            )}
          </div>

          {/* Medical History Textarea */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Medical History
            </label>
            <Controller
              name="medicalHistory"
              control={control}
              render={({ field: { value, onChange } }) => (
                <textarea
                  style={{
                    width: '100%',
                    height: '100px',
                    padding: '10px',
                    border: '1px solid #B8BDC9',
                    borderRadius: '4px',
                    resize: 'vertical',
                  }}
                  value={value}
                  onChange={onChange}
                />
              )}
              defaultValue=""
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: '#F15B43',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Submit
          </button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default RoleUpgradeModal;
