'use client';
import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import BlogSchema from '../validation';
import { addBlog, fetchBlogById, updateBlog } from 'apps/admin/app/api/Blogs';
import { zodResolver } from '@hookform/resolvers/zod';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCWysiwyg from 'apps/admin/components/SCForm/SCWysiwyg/index';
import { addFaq, fetchFaqById, updateFaq } from 'apps/admin/app/api/FAQ';

interface ICreate {
  question: string;
  answer: string;
}

function FAQForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(BlogSchema),
  });
  useEffect(() => {
    if (id) {
      fetchFaqById({ id })
        .then((response) => {
          reset({
            question: response.data.question,
            answer: response.data.answer,
          });
        })
        .catch((error) => {
          console.error('Error fetching faq:', error);
        });
    }
  }, [id, reset]);

  const FAQHandler = async (data: any) => {
    setLoading(true);

    // Update or add the blog

    if (id) {
      const updatedData = {
        ...data,
        id: id,
        question: data?.question || '',
        answer: data?.answer || '',
      };

      updateFaq(updatedData)
        .then((response) => {
          if (response.data.status === 201) {
            router.push('/faq');
            notification.success({
              message: response.data.message,
            });
          } else {
            notification.warning({
              message: response.data.message,
            });
          }
        })
        .catch((e) => {
          notification.error({ message: e.message });
        });
    } else {
      addFaq({ data })
        .then((response) => {
          if (response.data.status === 201) {
            router.push('/faq');
            notification.success({
              message: response.data.message,
            });
          } else {
            notification.error({
              message: response.data.createBlog.error(),
            });
          }
        })
        .catch((error) => {
          notification.error({ message: error.message });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(FAQHandler)} className="bg-white px-8 pb-8">
        <h3 className="text-xl font-bold mt-7  py-8 m-0">
          {id ? 'Edit' : 'Create'} FAQ
        </h3>
        <Row gutter={12}>
          <Col xs={24} xl={12}>
            <SCInput
              register={register}
              name="question"
              control={control}
              label="Question"
              parentClass="flex-grow mb-4"
              error={errors?.question?.message}
              placeholder="Question"
              size="large"
              required
            />
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} xl={12}>
            <SCWysiwyg
              name="answer"
              register={register}
              control={control}
              parentClass="flex-grow mb-4"
              label="Answer"
              error={errors?.answer?.message}
            />
          </Col>
        </Row>

        <Row>
          <div className="flex mt-4">
            <Button
              loading={loading}
              htmlType="submit"
              type="primary"
              size="large"
            >
              {id ? 'Update' : 'Create'}
            </Button>
            <Button
              htmlType="submit"
              onClick={() => router.push('/faq')}
              className="ml-4"
              size="large"
            >
              Cancel
            </Button>
          </div>
        </Row>
      </form>
    </>
  );
}

export default FAQForm;
