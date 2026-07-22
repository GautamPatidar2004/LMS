import React from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import TermsAndConditions from '../TermsAndConditions';

export default function StudentTerms() {
  return (
    <StudentLayout>
      <TermsAndConditions role="student" />
    </StudentLayout>
  );
}
