import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReviewerContext = createContext();

export const useReviewer = () => {
  const context = useContext(ReviewerContext);
  if (!context) {
    throw new Error('useReviewer must be used within a ReviewerProvider');
  }
  return context;
};

export const ReviewerProvider = ({ children }) => {
  const { user } = useAuth();
  const [examPublications, setExamPublications] = useState({});
  const [resultPublications, setResultPublications] = useState({});
  const [loading, setLoading] = useState(true);

  // Load publication states from localStorage
  useEffect(() => {
    const storedExamPubs = localStorage.getItem('examPublications');
    if (storedExamPubs) {
      setExamPublications(JSON.parse(storedExamPubs));
    }

    const storedResultPubs = localStorage.getItem('resultPublications');
    if (storedResultPubs) {
      setResultPublications(JSON.parse(storedResultPubs));
    }

    setLoading(false);
  }, []);

  // Save exam publications to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('examPublications', JSON.stringify(examPublications));
    }
  }, [examPublications, loading]);

  // Save result publications to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('resultPublications', JSON.stringify(resultPublications));
    }
  }, [resultPublications, loading]);

  // Publish midterm exam for a course
  const publishMidtermExam = (courseId, publishedBy = user?.id) => {
    setExamPublications(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        midtermPublished: true,
        midtermPublishedBy: publishedBy,
        midtermPublishedAt: new Date().toISOString()
      }
    }));

    return {
      success: true,
      message: 'Midterm exam published successfully. Students can now take the exam.'
    };
  };

  // Unpublish midterm exam
  const unpublishMidtermExam = (courseId) => {
    setExamPublications(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        midtermPublished: false,
        midtermPublishedBy: null,
        midtermPublishedAt: null
      }
    }));

    return {
      success: true,
      message: 'Midterm exam unpublished successfully.'
    };
  };

  // Publish final exam for a course
  const publishFinalExam = (courseId, publishedBy = user?.id) => {
    setExamPublications(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        finalPublished: true,
        finalPublishedBy: publishedBy,
        finalPublishedAt: new Date().toISOString()
      }
    }));

    return {
      success: true,
      message: 'Final exam published successfully. Students can now take the exam.'
    };
  };

  // Unpublish final exam
  const unpublishFinalExam = (courseId) => {
    setExamPublications(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        finalPublished: false,
        finalPublishedBy: null,
        finalPublishedAt: null
      }
    }));

    return {
      success: true,
      message: 'Final exam unpublished successfully.'
    };
  };

  // Check if midterm is published for a course
  const isMidtermPublished = (courseId) => {
    return examPublications[courseId]?.midtermPublished || false;
  };

  // Check if final exam is published for a course
  const isFinalPublished = (courseId) => {
    return examPublications[courseId]?.finalPublished || false;
  };

  // Publish results for a course
  const publishResults = (courseId, publishedBy = user?.id) => {
    setResultPublications(prev => ({
      ...prev,
      [courseId]: {
        published: true,
        publishedBy: publishedBy,
        publishedAt: new Date().toISOString()
      }
    }));

    return {
      success: true,
      message: 'Results published successfully. Students can now view their grades.'
    };
  };

  // Unpublish results for a course
  const unpublishResults = (courseId) => {
    setResultPublications(prev => ({
      ...prev,
      [courseId]: {
        published: false,
        publishedBy: null,
        publishedAt: null
      }
    }));

    return {
      success: true,
      message: 'Results unpublished successfully.'
    };
  };

  // Check if results are published for a course
  const areResultsPublished = (courseId) => {
    return resultPublications[courseId]?.published || false;
  };

  // Batch publish exams for multiple courses
  const batchPublishExams = (courseIds, examType = 'midterm') => {
    courseIds.forEach(courseId => {
      if (examType === 'midterm') {
        publishMidtermExam(courseId);
      } else {
        publishFinalExam(courseId);
      }
    });

    return {
      success: true,
      message: `${examType === 'midterm' ? 'Midterm' : 'Final'} exams published for ${courseIds.length} courses.`
    };
  };

  // Batch publish results for multiple courses
  const batchPublishResults = (courseIds) => {
    courseIds.forEach(courseId => {
      publishResults(courseId);
    });

    return {
      success: true,
      message: `Results published for ${courseIds.length} courses.`
    };
  };

  // Get all exam publications
  const getAllExamPublications = () => {
    return examPublications;
  };

  // Get all result publications
  const getAllResultPublications = () => {
    return resultPublications;
  };

  // Get publication info for a specific course
  const getCoursePublicationInfo = (courseId) => {
    return {
      exams: examPublications[courseId] || {
        midtermPublished: false,
        finalPublished: false
      },
      results: resultPublications[courseId] || {
        published: false
      }
    };
  };

  const value = {
    examPublications,
    resultPublications,
    loading,
    publishMidtermExam,
    unpublishMidtermExam,
    publishFinalExam,
    unpublishFinalExam,
    isMidtermPublished,
    isFinalPublished,
    publishResults,
    unpublishResults,
    areResultsPublished,
    batchPublishExams,
    batchPublishResults,
    getAllExamPublications,
    getAllResultPublications,
    getCoursePublicationInfo
  };

  return (
    <ReviewerContext.Provider value={value}>
      {children}
    </ReviewerContext.Provider>
  );
};
