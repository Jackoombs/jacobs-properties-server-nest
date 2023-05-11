import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import nodemailer from 'nodemailer';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMail', () => {
    it('should send an email', async () => {
      // Mock the nodemailer createTransport method
      const createTransportMock = jest
        .spyOn(nodemailer, 'createTransport')
        .mockReturnValue({
          sendMail: jest.fn().mockResolvedValue({
            messageId: '1234567890',
          }),
        } as any);

      // Call the sendMail method
      await emailService.sendMail(
        'test@example.com',
        'Test Subject',
        '<p>Test Body</p>',
      );

      // Check that the createTransport method was called with the correct options
      expect(createTransportMock).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.USERNAME,
          pass: process.env.PASSWORD,
        },
      });

      // Check that the sendMail method was called with the correct options
      expect(
        createTransportMock.mock.results[0].value.sendMail,
      ).toHaveBeenCalledWith({
        from: `"Jacobs Properties" <${process.env.USERNAME}>`,
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>',
      });
    });
  });
});
