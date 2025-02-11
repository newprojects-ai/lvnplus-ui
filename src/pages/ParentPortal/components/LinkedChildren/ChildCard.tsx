import React from 'react';
import { Card, Tag, Button, Tooltip } from 'antd';
import { 
  BookOutlined, 
  BarChartOutlined, 
  CalendarOutlined 
} from '@ant-design/icons';
import { ChildProfile } from '../../../../types/parent';
import { useNavigate } from 'react-router-dom';

interface Props {
  child: ChildProfile;
}

const ChildCard: React.FC<Props> = ({ child }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="w-full hover:shadow-lg transition-shadow duration-200"
      actions={[
        <Tooltip title="View Tests">
          <Button 
            type="text" 
            icon={<CalendarOutlined />}
            onClick={() => navigate(`/parent/children/${child.id}/tests`)}
          />
        </Tooltip>,
        <Tooltip title="View Subjects">
          <Button 
            type="text" 
            icon={<BookOutlined />}
            onClick={() => navigate(`/parent/children/${child.id}/subjects`)}
          />
        </Tooltip>,
        <Tooltip title="View Performance">
          <Button 
            type="text" 
            icon={<BarChartOutlined />}
            onClick={() => navigate(`/parent/children/${child.id}/performance`)}
          />
        </Tooltip>,
      ]}
    >
      <Card.Meta
        title={`${child.firstName} ${child.lastName}`}
        description={
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">Grade: </span>
              <span>{child.gradeLevel}</span>
            </div>
            <div>
              <span className="text-gray-500">School: </span>
              <span>{child.school}</span>
            </div>
            <div>
              <span className="text-gray-500">Curriculum: </span>
              <span>{child.curriculum}</span>
            </div>
            <div className="mt-2">
              {child.subjects.map((subject) => (
                <Tag key={subject.id} color="blue" className="mr-1 mb-1">
                  {subject.name}
                </Tag>
              ))}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ChildCard;
