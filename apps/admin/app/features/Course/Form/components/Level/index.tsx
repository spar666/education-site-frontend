import React from 'react';
import CourseForm from '../course';
import { Button, Col, Row } from 'antd';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCTextArea from 'apps/admin/components/SCForm/SCTextArea';

export default function StudyLevelForm({
  register,
  fieldArray,
  control,
  errors,
}: {
  register: any;
  fieldArray: any;
  control: any;
  errors: any;
}) {
  return (
    <CourseForm>
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} xl={7}>
          <SCInput
            register={register}
            name="name"
            control={control}
            label="Study Level"
            parentClass="flex-grow mb-4"
            error={errors?.title?.message}
            placeholder="Study Level"
            size="large"
            required
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <SCTextArea
            register={register}
            name="description"
            control={control}
            label="Level Description"
            parentClass="flex-grow mb-4"
            error={errors?.title?.message}
            placeholder="Level Description"
            size="large"
            required
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <SCTextArea
            register={register}
            name="otherDescription"
            control={control}
            label="Other Description"
            parentClass="flex-grow mb-4"
            error={errors?.title?.message}
            placeholder="Other Description"
            size="large"
            required
          />
        </Col>
      </Row>

      <Button
        onClick={() => {
          fieldArray?.append({
            days: 1,
            name: null,
          });
        }}
        id="addStudyLevel"
        size="large"
        className="mt-4"
      >
        Add Study Level
      </Button>
    </CourseForm>
  );
}
